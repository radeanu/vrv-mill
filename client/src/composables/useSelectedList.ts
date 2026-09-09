import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useLoading } from '@/composables/useLoading'
import { useEventBus } from '@/composables/useEventBus'
import {
  postResetAllData,
  fetchSelectedList,
  postUpdateItemOrder,
  type SelectItemTask,
  type TaskResStatus,
  type UpdateItemPosTask,
} from '@/services/api.service'
import { useTasksQueue } from './useTasksQueue'
import { useDragAndDrop, type DropPayload } from './useDragAndDrop'

const tasksQueue = useTasksQueue()

export function useSelectedList() {
  const hasMore = ref(false)
  const searchId = ref<number>()
  const cursor = ref<number | null>(null)

  const list = ref<Array<{ idx: number; id: number; _loading?: boolean }>>([])
  const pendingList = ref<Array<{ idx: number; id: number }>>([])

  const eventBus = useEventBus()
  const listLoader = useLoading()
  const dragAndDrop = useDragAndDrop(_onDrop)

  const searchParams = computed(() => {
    const params: { cursor?: string; id?: string } = {}

    if (cursor.value !== null) {
      params.cursor = cursor.value.toString()
    }

    if (searchId.value !== undefined) {
      params.id = searchId.value.toString()
    }

    return params
  })

  watch(searchId, async () => {
    cursor.value = null
    list.value.length = 0
    tasksQueue.removeTasksByName('updateItemPos')
    await fetchItems()
  })

  onMounted(async () => {
    await fetchItems()
    eventBus.on('selectItem', handleSelectItem)
    eventBus.on('commitSelectItem', handleCommitSelectItem)
    eventBus.on('rollBackSelectItem', handleRollBackSelectItem)
    eventBus.on('task:status/updateItemPos', handleUpdateItemPosTaskStatus)
  })

  onBeforeUnmount(() => {
    eventBus.off('selectItem', handleSelectItem)
    eventBus.off('rollBackSelectItem', handleCommitSelectItem)
    eventBus.off('rollBackSelectItem', handleRollBackSelectItem)
  })

  function handleUpdateItemPosTaskStatus(res: TaskResStatus<UpdateItemPosTask['payload']>) {
    if (!res.task) return

    const targetTask = tasksQueue.get(res.key)
    if (targetTask?.name !== 'updateItemPos') return

    tasksQueue.remove(res.key)

    const payload = targetTask.payload
    const listItem = list.value.find((v) => v.id === payload.id && v.idx === payload.idx)

    if (!listItem) return

    listItem._loading = false

    if (res.task.status === 'error' && listItem) {
      const [removedItem] = list.value.splice(payload.newPos, 1)

      if (removedItem) {
        list.value.splice(payload.oldPos, 0, removedItem)
      }
    }
  }

  function handleSelectItem(item: SelectItemTask['payload']) {
    pendingList.value.unshift(item)
  }

  function handleCommitSelectItem(item: SelectItemTask['payload']) {
    pendingList.value = pendingList.value.filter((v) => v.id !== item.id && v.idx !== item.idx)
    list.value.unshift(item)
  }

  function handleRollBackSelectItem(item: SelectItemTask['payload']) {
    pendingList.value = pendingList.value.filter((v) => v.id !== item.id && v.idx !== item.idx)
  }

  function _getNewPos(payload: DropPayload) {
    const dragId = parseInt(payload.draggedEl.dataset.id || '', 10)
    const dragIdx = parseInt(payload.draggedEl.dataset.idx || '', 10)

    const targetId = parseInt(payload.targetEl.dataset.id || '', 10)
    const targetIdx = parseInt(payload.targetEl.dataset.idx || '', 10)

    if ([dragId, dragIdx, targetId, targetIdx].some((v) => !isFinite(v))) return null

    const listDragIdx = list.value.findIndex((v) => v.id === dragId && v.idx === dragIdx)
    const listTargetIdx = list.value.findIndex((v) => v.id === targetId && v.idx === targetIdx)

    if (listDragIdx === -1 || listTargetIdx === -1) return null

    let newIdx = listTargetIdx

    if (payload.position === 'after') {
      newIdx = listDragIdx < listTargetIdx ? listTargetIdx : listTargetIdx + 1
    } else {
      newIdx = listDragIdx < listTargetIdx ? listTargetIdx - 1 : listTargetIdx
    }

    newIdx = Math.max(0, Math.min(newIdx, list.value.length - 1))

    return {
      id: dragId,
      idx: dragIdx,
      oldPos: listDragIdx,
      newPos: newIdx,
    }
  }

  function onDragInit(ev: MouseEvent) {
    dragAndDrop.init(ev, 2)
  }

  async function _onDrop(payload: DropPayload) {
    const result = _getNewPos(payload)
    if (result === null) return

    const sent = await updateItemOrder({
      id: result.id,
      idx: result.idx,
      oldPos: result.oldPos,
      newPos: result.newPos,
      searchId: searchId.value,
    })

    const el = list.value[result.oldPos]
    if (el !== undefined) el._loading = true

    if (sent) {
      const [removedItem] = list.value.splice(result.oldPos, 1)

      if (removedItem) {
        list.value.splice(result.newPos, 0, removedItem)
      }
    }
  }

  async function fetchItems() {
    try {
      listLoader.start()

      const res = await fetchSelectedList(searchParams.value)
      hasMore.value = res.hasMore
      cursor.value = res.nextCursor

      list.value.push(...res.items)
    } catch (error) {
      console.error(error)
    } finally {
      listLoader.end()
    }
  }

  async function updateItemOrder(payload: UpdateItemPosTask['payload']) {
    try {
      const sent = await postUpdateItemOrder(payload)

      return sent
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async function resetAllData() {
    try {
      await postResetAllData()
      location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    list,
    hasMore,
    searchId,
    listLoader,
    fetchItems,
    onDragInit,
    pendingList,
    resetAllData,
  }
}

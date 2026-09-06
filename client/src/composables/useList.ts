import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useLoading } from '@/composables/useLoading'
import { useEventBus } from '@/composables/useEventBus'
import { fetchList, postAddNewId, postSelectItem, type TaskResStatus } from '@/services/api.service'
import { useTasksQueue } from './useTasksQueue'

const tasksQueue = useTasksQueue()

export function useList() {
  const hasMore = ref(false)
  const newId = ref<number>()
  const searchId = ref<number>()
  const cursor = ref<number | null>(null)

  const list = ref<Array<{ idx: number; id: number }>>([])
  const pendingList = ref<Array<{ id: number; key: string }>>([])

  const eventBus = useEventBus()
  const addLoader = useLoading()
  const listLoader = useLoading()

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

  const disableAddBtn = computed(() => {
    return addLoader.isLoading.value || newId.value === undefined
  })

  watch(searchId, async () => {
    cursor.value = null
    list.value.length = 0
    await fetchItems()
  })

  onMounted(async () => {
    await fetchItems()
    eventBus.on('task:status/addItem', handleAddTaskStatus)
    eventBus.on('task:status/selectItem', handleSelectItemTaskStatus)
  })

  onBeforeUnmount(() => {
    eventBus.off('task:status/addItem', handleAddTaskStatus)
    eventBus.off('task:status/selectItem', handleSelectItemTaskStatus)
  })

  function handleAddTaskStatus(res: TaskResStatus<{ idx?: number }>) {
    if (!res.task) return

    const targetTask = tasksQueue.get(res.key)
    if (targetTask?.name !== 'addItem') return

    const payload = res.task.payload

    if (res.task.status === 'success' && payload?.idx !== undefined) {
      list.value.unshift({ id: targetTask.payload.id, idx: payload.idx })
    }

    pendingList.value = pendingList.value.filter((v) => v.key !== targetTask.key)
  }

  function handleSelectItemTaskStatus(res: TaskResStatus<{}>) {
    if (!res.task) return

    const targetTask = tasksQueue.get(res.key)
    if (targetTask?.name !== 'selectItem') return

    tasksQueue.remove(res.key)

    const item = targetTask.payload

    if (res.task.status === 'success') {
      eventBus.emit('commitSelectItem', item)
      return
    }

    const insPos = list.value.findIndex((v) => v.idx < item.idx)

    if (insPos === -1) {
      list.value.push(item)
    } else {
      list.value.splice(insPos, 0, item)
    }

    list.value.splice(item.idx, 0, item)
    eventBus.emit('rollBackSelectItem', item)
  }

  async function nextPage() {
    await fetchItems()
  }

  async function fetchItems() {
    try {
      listLoader.start()

      const res = await fetchList(searchParams.value)
      hasMore.value = res.hasMore
      cursor.value = res.nextCursor

      list.value.push(...res.items)
    } catch (error) {
      console.log(error)
    } finally {
      listLoader.end()
    }
  }

  async function addNewId() {
    try {
      if (newId.value === undefined) return
      addLoader.start()

      const res = await postAddNewId(newId.value)

      if (res.sent) {
        pendingList.value.unshift({ id: newId.value, key: res.key })
        newId.value = undefined
      }
    } catch (error) {
      console.log(error)
    } finally {
      addLoader.end()
    }
  }

  async function selectItem(id: number, idx: number) {
    try {
      const sent = await postSelectItem(id, idx)

      if (sent) {
        eventBus.emit('selectItem', { id, idx })
        list.value = list.value.filter((v) => v.idx !== idx)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    list,
    newId,
    hasMore,
    nextPage,
    searchId,
    addNewId,
    addLoader,
    listLoader,
    fetchItems,
    selectItem,
    pendingList,
    disableAddBtn,
  }
}

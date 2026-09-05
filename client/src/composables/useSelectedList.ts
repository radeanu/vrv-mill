import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useLoading } from '@/composables/useLoading'
import { useEventBus } from '@/composables/useEventBus'
import { fetchSelectedList, type SelectItemTask, type TaskResStatus } from '@/services/api.service'
import { useTasksQueue } from './useTasksQueue'

const tasksQueue = useTasksQueue()

export function useSelectedList() {
  const hasMore = ref(false)
  const searchId = ref<number>()
  const cursor = ref<number | null>(null)

  const list = ref<Array<{ idx: number; id: number }>>([])
  const pendingList = ref<Array<{ idx: number; id: number }>>([])

  const eventBus = useEventBus()
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

  watch(searchId, async () => {
    cursor.value = null
    list.value.length = 0
    await fetchItems()
  })

  onMounted(async () => {
    await fetchItems()
    eventBus.on('selectItem', handleSelectItem)
    eventBus.on('commitSelectItem', handleCommitSelectItem)
    eventBus.on('rollBackSelectItem', handleRollBackSelectItem)
  })

  onBeforeUnmount(() => {
    eventBus.off('selectItem', handleSelectItem)
    eventBus.off('rollBackSelectItem', handleCommitSelectItem)
    eventBus.off('rollBackSelectItem', handleRollBackSelectItem)
  })

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

  async function nextPage() {
    await fetchItems()
  }

  async function fetchItems() {
    try {
      listLoader.start()

      const res = await fetchSelectedList(searchParams.value)
      hasMore.value = res.hasMore
      cursor.value = res.nextCursor

      list.value.push(...res.items)
    } catch (error) {
      console.log(error)
    } finally {
      listLoader.end()
    }
  }

  return {
    list,
    hasMore,
    nextPage,
    searchId,
    listLoader,
    fetchItems,
    pendingList,
  }
}

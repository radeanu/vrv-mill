import { computed, ref, watch } from 'vue'

import { useLoading } from '@/composables/useLoading'
import { fetchList, postAddNewId } from '@/services/api.service'

export function useList() {
  const page = ref(1)
  const hasMore = ref(false)
  const list = ref<number[]>([])
  const newId = ref<number>()
  const searchId = ref<number>()

  const listLoader = useLoading()
  const addLoader = useLoading()

  const searchParams = computed(() => {
    const params: { page: string; id?: string } = {
      page: page.value.toString(),
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
    page.value = 1
    list.value.length = 0
    await fetchItems()
  })

  async function nextPage() {
    page.value += 1
    await fetchItems()
  }

  async function fetchItems() {
    try {
      listLoader.start()

      const res = await fetchList(searchParams.value)
      hasMore.value = res.hasMore

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

      const sent = await postAddNewId(newId.value)

      if (sent) {
        newId.value = undefined
      }
    } catch (error) {
      console.log(error)
    } finally {
      addLoader.end()
    }
  }

  return {
    list,
    page,
    newId,
    hasMore,
    nextPage,
    searchId,
    addNewId,
    addLoader,
    listLoader,
    fetchItems,
    disableAddBtn,
  }
}

import { computed, ref, watch } from 'vue'

import { useLoading } from '@/composables/useLoading'
import { fetchSelectedList, type ListItem } from '@/services/api.service'

export function useSelectedList() {
  const page = ref(1)
  const hasMore = ref(false)
  const list = ref<ListItem[]>([])
  const newId = ref<number>()
  const searchId = ref<number>()

  const listLoader = useLoading()
  //   const addLoader = useLoading()

  const searchParams = computed(() => {
    const params: { page: string; id?: string } = {
      page: page.value.toString(),
    }

    if (searchId.value !== undefined) {
      params.id = searchId.value.toString()
    }

    return params
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

      const res = await fetchSelectedList(searchParams.value)
      hasMore.value = res.hasMore

      list.value.push(...res.items)
    } catch (error) {
      console.log(error)
    } finally {
      listLoader.end()
    }
  }

  return {
    list,
    page,
    newId,
    hasMore,
    nextPage,
    searchId,
    listLoader,
    fetchItems,
  }
}

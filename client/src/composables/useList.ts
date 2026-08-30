import { ref } from 'vue'

export function useList() {
  const limit = 20
  const url = new URL('http://localhost:3000/api/v1/list')

  const list = ref<number[]>([])
  const offset = ref(0)

  function nextPage() {
    offset.value += limit
  }

  async function fetchItems() {
    try {
      url.search = new URLSearchParams({
        offset: offset.value.toString(),
        limit: limit.toString(),
      }).toString()

      const res = await fetch(url, { method: 'GET' })
      const jsonData = await res.json()

      return list.value.push(...jsonData)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    list,
    limit,
    offset,
    nextPage,
    fetchItems,
  }
}

export type PaginatedResult = {
  items: number[]
  hasMore: boolean
}

export async function fetchList(searchParams: {}) {
  const getListUrl = new URL('http://localhost:3000/api/v1/list')
  getListUrl.search = new URLSearchParams(searchParams).toString()

  const res = await fetch(getListUrl, { method: 'GET' })
  const data = (await res.json()) as PaginatedResult

  return data
}

export async function postAddNewId(id: number) {
  const addIdUrl = new URL('http://localhost:3000/api/v1/list/add')
  const body = JSON.stringify({ id })

  const res = await fetch(addIdUrl, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
      idempotency_key: crypto.randomUUID(),
    },
  })

  return res.ok
}

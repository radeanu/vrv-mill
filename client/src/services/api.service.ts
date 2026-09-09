import { useTasksQueue } from '@/composables/useTasksQueue'

export type PaginatedResult = {
  hasMore: boolean
  totalPages: number
  nextCursor: number | null
  items: Array<{ idx: number; id: number }>
}

export type AddItemTask = {
  key: string
  name: 'addItem'
  payload: {
    id: number
  }
}

export type SelectItemTask = {
  key: string
  name: 'selectItem'
  payload: {
    id: number
    idx: number
  }
}

export type UpdateItemPosTask = {
  key: string
  name: 'updateItemPos'
  payload: {
    id: number
    idx: number
    oldPos: number
    newPos: number
    searchId?: number
  }
}

export type Task = AddItemTask | SelectItemTask | UpdateItemPosTask
export type TaskStatus<T> = {
  payload: T
  timestamp: number
  status: 'error' | 'success'
  name: 'addItem' | 'selectItem' | 'updateItemPos'
}
export type TaskResStatus<T> = { key: string; task?: TaskStatus<T> }

const tasksQueue = useTasksQueue()

const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin

async function _postNewTask(url: URL, body: string) {
  const idpKey = crypto.randomUUID()

  const res = await fetch(url, {
    method: 'POST',
    body,
    headers: {
      idempotency_key: idpKey,
      'Content-Type': 'application/json',
    },
  })

  return { sent: res.status === 202, key: idpKey }
}

export async function fetchList(searchParams: {}) {
  const getListUrl = new URL(API_BASE_URL + '/api/v1/list')
  getListUrl.search = new URLSearchParams(searchParams).toString()

  const res = await fetch(getListUrl, { method: 'GET' })
  const data = (await res.json()) as PaginatedResult

  return data
}

export async function fetchSelectedList(searchParams: {}) {
  const getListUrl = new URL(API_BASE_URL + '/api/v1/list/selected')
  getListUrl.search = new URLSearchParams(searchParams).toString()

  const res = await fetch(getListUrl, { method: 'GET' })
  const data = (await res.json()) as PaginatedResult

  return data
}

export async function postGetTasksStatus(tasks: string[]): Promise<TaskResStatus<unknown>[]> {
  const getUrl = new URL(API_BASE_URL + '/api/v1/task/get-status')
  const body = JSON.stringify(tasks)

  const res = await fetch(getUrl, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = (await res.json()) as TaskResStatus<unknown>[]
  return data
}

export async function postAddNewId(id: number) {
  const addIdUrl = new URL(API_BASE_URL + '/api/v1/list/add')
  const body = JSON.stringify({ id })

  const res = await _postNewTask(addIdUrl, body)
  if (res.sent) {
    tasksQueue.add(res.key, {
      key: res.key,
      name: 'addItem',
      payload: { id },
    })
  }

  return res
}

export async function postSelectItem(id: number, idx: number) {
  const url = new URL(API_BASE_URL + '/api/v1/list/select-item')
  const body = JSON.stringify({ id, idx })

  const res = await _postNewTask(url, body)

  if (res.sent) {
    tasksQueue.add(res.key, {
      key: res.key,
      name: 'selectItem',
      payload: { id, idx },
    })
  }

  return res.sent
}

export async function postUpdateItemOrder(payload: UpdateItemPosTask['payload']) {
  const url = new URL(API_BASE_URL + '/api/v1/list/update-order')
  const body = JSON.stringify({
    oldPos: payload.oldPos,
    newPos: payload.newPos,
    searchId: payload.searchId,
  })

  const res = await _postNewTask(url, body)

  if (res.sent) {
    tasksQueue.add(res.key, {
      key: res.key,
      name: 'updateItemPos',
      payload,
    })
  }

  return res.sent
}

export async function postResetAllData() {
  const url = new URL(API_BASE_URL + '/api/v1/list/reset')

  const res = await fetch(url, { method: 'POST' })

  return res.ok
}

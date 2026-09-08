import type { TaskResStatus, SelectItemTask, UpdateItemPosTask } from '@/services/api.service'

export interface AppEvents {
  selectItem: SelectItemTask['payload']
  commitSelectItem: SelectItemTask['payload']
  rollBackSelectItem: SelectItemTask['payload']
  'task:status/addItem': TaskResStatus<{ idx?: number }>
  'task:status/selectItem': TaskResStatus<{}>
  'task:status/updateItemPos': TaskResStatus<UpdateItemPosTask['payload']>
}

const listeners: { [K in keyof AppEvents]?: ((data: AppEvents[K]) => void)[] } = {}

export function useEventBus() {
  const on = <K extends keyof AppEvents>(event: K, callback: (data: AppEvents[K]) => void) => {
    if (!listeners[event]) listeners[event] = []
    listeners[event]!.push(callback)
    return () => off(event, callback)
  }

  const off = <K extends keyof AppEvents>(event: K, callback: (data: AppEvents[K]) => void) => {
    if (!listeners[event]) return
    listeners[event] = listeners[event]!.filter((cb) => cb !== callback) as any
  }

  const emit = <K extends keyof AppEvents>(
    event: K,
    ...args: AppEvents[K] extends void ? [] : [data: AppEvents[K]]
  ) => {
    if (!listeners[event]) return
    const [data] = args
    listeners[event]!.forEach((callback) => callback(data as AppEvents[K]))
  }

  return { on, off, emit }
}

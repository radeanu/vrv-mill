import { useEventBus } from '@/composables/useEventBus'
import {
  postGetTasksStatus,
  type AddItemTask,
  type SelectItemTask,
  type Task,
  type UpdateItemPosTask,
} from '@/services/api.service'

const tasksQueue = new Map<string, Task>()

const eventBus = useEventBus()

export function useTasksQueue() {
  function add(key: string, task: Task) {
    tasksQueue.set(key, task)
  }

  function get(key: string) {
    const item = tasksQueue.get(key)

    if (item?.name === 'addItem') {
      return item as AddItemTask
    }

    if (item?.name === 'selectItem') {
      return item as SelectItemTask
    }

    if (item?.name === 'updateItemPos') {
      return item as UpdateItemPosTask
    }
  }

  function remove(key: string) {
    tasksQueue.delete(key)
  }

  function watchForStatuses() {
    setInterval(async () => {
      try {
        if (!tasksQueue.size) return

        const data = await postGetTasksStatus([...tasksQueue.keys()])

        data.forEach((item) => {
          if (item.task === undefined) return

          eventBus.emit('task:status', item)
          tasksQueue.delete(item.key)
        })
      } catch (error) {
        console.log(error)
      }
    }, 1000)
  }

  return {
    add,
    get,
    remove,
    watchForStatuses,
  }
}

import { useEventBus } from '@/composables/useEventBus'
import {
  postGetTasksStatus,
  type AddItemTask,
  type SelectItemTask,
  type Task,
  type TaskResStatus,
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

          if (item.task.name === 'addItem') {
            eventBus.emit('task:status/addItem', item as TaskResStatus<{ idx?: number }>)
          }

          if (item.task.name === 'selectItem') {
            eventBus.emit('task:status/selectItem', item as TaskResStatus<{}>)
          }

          if (item.task.name === 'updateItemPos') {
            eventBus.emit('task:status/updateItemPos', item as TaskResStatus<{}>)
          }

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

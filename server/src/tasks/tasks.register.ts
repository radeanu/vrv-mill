import { type Tasks, addTaskToQueue } from './tasks.queue';

const _tasksRegister = new Set<string>();

export function useTaskRegister() {
	function taskExists(key: string) {
		return _tasksRegister.has(key);
	}

	function addTask(task: Tasks) {
		if (taskExists(task.key)) return;

		_tasksRegister.add(task.key);
		addTaskToQueue(task);
	}

	function removeTask(key: string) {
		_tasksRegister.delete(key);
	}

	return {
		addTask,
		taskExists,
		removeTask,
	};
}

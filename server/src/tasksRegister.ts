const _tasksRegister = new Set<string>();

export function useTaskRegister() {
	function taskExists(key: string) {
		return _tasksRegister.has(key);
	}

	function addTask(key: string) {
		if (taskExists(key)) return;

		_tasksRegister.add(key);
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

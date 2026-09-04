export type TaskStatus = {
	payload: unknown;
	timestamp: number;
	status: 'error' | 'success';
	name: 'addItem' | 'selectItem' | 'updateItemPos';
};

const _tasksStatus = new Map<string, TaskStatus>();

const STATUS_TTL = 5 * 60000;

export function useTasksStatus() {
	function get(key: string) {
		return _tasksStatus.get(key);
	}

	function add(key: string, status: TaskStatus) {
		_tasksStatus.set(key, status);
	}

	function remove(key: string) {
		_tasksStatus.delete(key);
	}

	function cleanUpOldStatuses() {
		_tasksStatus.forEach((st, key) => {
			const exceedTime = Date.now() - st.timestamp > STATUS_TTL;

			if (exceedTime) {
				_tasksStatus.delete(key);

				console.log(`Old status removed: ${key} - ${st.name}`);
			}
		});
	}

	return {
		get,
		add,
		remove,
		cleanUpOldStatuses,
	};
}

export type AddItemTask = {
	key: string;
	name: 'addItem';
	payload: {
		id: number;
	};
};

export type SelectItemTask = {
	key: string;
	name: 'selectItem';
	payload: {
		idx: number;
	};
};

export type UpdateItemPosTask = {
	key: string;
	name: 'updateItemPos';
	payload: {
		oldPos: number;
		newPos: number;
	};
};

export type Tasks = AddItemTask | SelectItemTask | UpdateItemPosTask;

function _createQueue<T extends Tasks>() {
	let _queue: T[] = [];

	function addTask(task: T) {
		_queue.push(task);
	}

	function getAndFlushTasks() {
		const items = [..._queue];
		_queue.length = 0;
		return items;
	}

	return { addTask, getAndFlushTasks };
}

export const addTasksQ = _createQueue<AddItemTask>();
export const changeTasksQ = _createQueue<SelectItemTask | UpdateItemPosTask>();

export function addTaskToQueue(task: Tasks) {
	if (task.name === 'addItem') {
		addTasksQ.addTask(task);
	}

	if (task.name === 'selectItem' || task.name === 'updateItemPos') {
		changeTasksQ.addTask(task);
	}
}

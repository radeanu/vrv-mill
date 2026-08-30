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
		id: number;
		pos: number;
	};
};

export type UpdateItemPosTask = {
	key: string;
	name: 'updateItemPos';
	payload: {
		id: number;
		oldPos: number;
		newPos: number;
	};
};

export type Tasks = AddItemTask | SelectItemTask | UpdateItemPosTask;

function createQueue<T extends Tasks>() {
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

export const baseTasksQ = createQueue<AddItemTask>();
export const changeTasksQ = createQueue<SelectItemTask | UpdateItemPosTask>();

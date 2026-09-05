import { useAddItemTask, useSelectItemTask, useUpdateItemPosTask } from './tasks.list';
import { useTaskRegister } from './tasks.register';
import { useTasksStatus, type TaskStatus } from './tasks.status';

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

const tasksStatus = useTasksStatus();
const taskRegister = useTaskRegister();
const addItemTask = useAddItemTask();
const selectItemTask = useSelectItemTask();
const updateItemPosTask = useUpdateItemPosTask();

function _createQueue<T extends Tasks>(
	getUniqueKey: (task: T) => string,
	getDuplicateStatus: (task: T) => TaskStatus,
) {
	const _queue: T[] = [];
	const _seen = new Set<string>();

	function addTask(task: T): boolean {
		const uniqueKey = getUniqueKey(task);

		if (_seen.has(uniqueKey)) {
			const status = getDuplicateStatus(task);
			taskRegister.removeTask(task.key);
			tasksStatus.add(task.key, status);
			return false;
		}

		_seen.add(uniqueKey);
		_queue.push(task);
		return true;
	}

	function getAndFlushTasks() {
		const items = [..._queue];
		_queue.length = 0;
		_seen.clear();
		return items;
	}

	return { addTask, getAndFlushTasks };
}

export const addTasksQ = _createQueue<AddItemTask>(addItemTask.getUniqueKey, (t) =>
	addItemTask.getStatus(false, t.payload),
);
export const changeTasksQ = _createQueue<SelectItemTask | UpdateItemPosTask>(
	(t) => (t.name === 'selectItem' ? selectItemTask.getUniqueKey(t) : updateItemPosTask.getUniqueKey(t)),
	(t) => (t.name === 'selectItem' ? selectItemTask.getStatus(false) : updateItemPosTask.getStatus(false)),
);

export function addTaskToQueue(task: Tasks) {
	if (task.name === 'addItem') {
		addTasksQ.addTask(task);
	}

	if (task.name === 'selectItem') {
		changeTasksQ.addTask(task);
	}

	if (task.name === 'updateItemPos') {
		changeTasksQ.addTask(task);
	}
}

import type { Tasks } from '@/tasks/tasks.queue';
import { splitIntoChunksByLimit } from '@/common';
import { useTaskRegister } from '@/tasks/tasks.register';
import { useAddItemTask, useSelectItemTask, useUpdateItemPosTask } from '@/tasks/tasks.list';

const taskRegister = useTaskRegister();

const addItemTask = useAddItemTask();
const selectItemTask = useSelectItemTask();
const updateItemPosTask = useUpdateItemPosTask();

function _runTask(task: Tasks) {
	if (task.name === 'addItem') {
		addItemTask.executeTask(task);
	}

	if (task.name === 'selectItem') {
		selectItemTask.executeTask(task);
	}

	if (task.name === 'updateItemPos') {
		updateItemPosTask.executeTask(task);
	}

	taskRegister.removeTask(task.key);
}

export async function runTasks(tasks: Tasks[]) {
	const baseTasks = tasks.filter((t) => t.name === 'updateItemPos');
	const parallelTasks = tasks.filter((t) => t.name === 'addItem' || t.name === 'selectItem');
	const parallelChunks = splitIntoChunksByLimit(parallelTasks, 100);

	for (const tasksChunk of parallelChunks) {
		await Promise.allSettled(
			tasksChunk.map((t) => {
				_runTask(t);
			}),
		);
	}

	for (const task of baseTasks) {
		_runTask(task);
	}
}

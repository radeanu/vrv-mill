import { runTasks } from '@/tasks/tasks.runner';
import { useTasksResponse } from '@/tasks/tasks.response';
import { changeTasksQ, addTasksQ } from '@/tasks/tasks.queue';
import { cleanUpCachedPages, clearCachedPages } from '@/cache/list.cache';

const tasksResponse = useTasksResponse();

setInterval(() => {
	const tasks = changeTasksQ.getAndFlushTasks();
	console.log({ name: 'changeTasksQ', length: tasks.length });

	if (!tasks.length) return;

	if (tasks.some((t) => t.name === 'selectItem')) {
		clearCachedPages();
	}

	runTasks(tasks);
}, 1000);

setInterval(() => {
	const tasks = addTasksQ.getAndFlushTasks();
	console.log({ name: 'addTasksQ', length: tasks.length });

	if (!tasks.length) return;

	runTasks(tasks);
}, 10_000);

setInterval(() => {
	tasksResponse.cleanUpOldResponses();
	cleanUpCachedPages();
}, 1000);

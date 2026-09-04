import { runTasks } from '@/tasks/tasks.runner';
import { useTasksStatus } from '@/tasks/tasks.status';
import { changeTasksQ, addTasksQ } from '@/tasks/tasks.queue';
import { cleanUpCachedPages, clearCachedPages } from '@/cache/list.cache';

const tasksStatus = useTasksStatus();

setInterval(() => {
	const tasks = changeTasksQ.getAndFlushTasks();
	if (!tasks.length) return;

	console.log({ name: 'changeTasksQ', length: tasks.length });

	if (tasks.some((t) => t.name === 'selectItem')) {
		clearCachedPages();
	}

	runTasks(tasks);
}, 1000);

setInterval(() => {
	const tasks = addTasksQ.getAndFlushTasks();
	if (!tasks.length) return;

	console.log({ name: 'addTasksQ', length: tasks.length });

	runTasks(tasks);
}, 10_000);

setInterval(() => {
	tasksStatus.cleanUpOldStatuses();
	cleanUpCachedPages();
}, 1000);

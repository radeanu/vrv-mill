import { logger } from '@/config';
import { listRepo } from '@/repository';
import { useTasksStatus, type TaskStatus } from '@/tasks/tasks.status';
import type { AddItemTask, SelectItemTask, UpdateItemPosTask } from '@/tasks/tasks.queue';

const tasksStatus = useTasksStatus();

function _getTaskStatus(name: TaskStatus['name'], success: boolean, payload?: unknown): TaskStatus {
	return {
		name,
		payload,
		timestamp: +new Date(),
		status: success ? 'success' : 'error',
	};
}

export function useAddItemTask() {
	function getStatus(success: boolean, payload?: unknown) {
		return _getTaskStatus('addItem', success, payload);
	}

	function getUniqueKey(task: AddItemTask) {
		return task.payload.id.toString();
	}

	function executeTask(task: AddItemTask) {
		try {
			const res = listRepo.addItemToList(task.payload.id);
			const status = getStatus(res.success, { idx: res.idx });

			tasksStatus.add(task.key, status);
		} catch (error) {
			logger.error(error);
			tasksStatus.add(task.key, getStatus(false));
		}
	}

	return {
		getStatus,
		executeTask,
		getUniqueKey,
	};
}

export function useSelectItemTask() {
	function getStatus(success: boolean) {
		return _getTaskStatus('selectItem', success);
	}

	function getUniqueKey(task: SelectItemTask) {
		return `select:${task.payload.idx}`;
	}

	function executeTask(task: SelectItemTask) {
		try {
			const successRes = listRepo.selectItem(task.payload.idx);
			const status = getStatus(successRes);

			tasksStatus.add(task.key, status);
		} catch (error) {
			logger.error(error);
			tasksStatus.add(task.key, getStatus(false));
		}
	}

	return {
		getStatus,
		executeTask,
		getUniqueKey,
	};
}

export function useUpdateItemPosTask() {
	function getStatus(success: boolean) {
		return _getTaskStatus('updateItemPos', success);
	}

	function getUniqueKey(task: UpdateItemPosTask) {
		return `update:${task.payload.oldPos}_${task.payload.newPos}`;
	}

	function executeTask(task: UpdateItemPosTask) {
		try {
			const successRes = listRepo.updateSelectedItemPos(task.payload.oldPos, task.payload.newPos);
			const status = getStatus(successRes);

			tasksStatus.add(task.key, status);
		} catch (error) {
			logger.error(error);
			tasksStatus.add(task.key, getStatus(false));
		}
	}

	return {
		getStatus,
		executeTask,
		getUniqueKey,
	};
}

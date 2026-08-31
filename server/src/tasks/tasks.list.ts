import { logger } from '@/config';
import { listRepo } from '@/repository';
import type { AddItemTask, SelectItemTask, UpdateItemPosTask } from '@/tasks/tasks.queue';
import {
	useTasksResponse,
	type AddItemResp,
	type SelectItemResp,
	type UpdateItemPosResp,
} from '@/tasks/tasks.response';

const tasksRes = useTasksResponse();

export function useAddItemTask() {
	function getSuccessRes(): AddItemResp {
		return {
			name: 'addItem',
			timestamp: +new Date(),
			status: {
				name: 'success',
				payload: {},
			},
		};
	}

	function getErrorRes(message?: string): AddItemResp {
		return {
			name: 'addItem',
			timestamp: +new Date(),
			status: {
				name: 'error',
				message: message ?? 'Error on add new item',
			},
		};
	}

	function executeTask(task: AddItemTask) {
		try {
			const successRes = listRepo.addItemToList(task.payload.id);
			const resVariant = successRes ? getSuccessRes() : getErrorRes();

			tasksRes.addResponse(task.key, resVariant);
		} catch (error) {
			logger.error(error);
			tasksRes.addResponse(task.key, getErrorRes('Unknown Error'));
		}
	}

	return {
		executeTask,
		getErrorRes,
		getSuccessRes,
	};
}

export function useSelectItemTask() {
	function getSuccessRes(): SelectItemResp {
		return {
			name: 'selectItem',
			timestamp: +new Date(),
			status: {
				name: 'success',
				payload: {},
			},
		};
	}

	function getErrorRes(message?: string): SelectItemResp {
		return {
			name: 'selectItem',
			timestamp: +new Date(),
			status: {
				name: 'error',
				message: message ?? 'Error on select item',
			},
		};
	}

	function executeTask(task: SelectItemTask) {
		try {
			const successRes = listRepo.selectItem(task.payload.id, task.payload.idx);
			const resVariant = successRes ? getSuccessRes() : getErrorRes();

			tasksRes.addResponse(task.key, resVariant);
		} catch (error) {
			logger.error(error);
			tasksRes.addResponse(task.key, getErrorRes('Unknown Error'));
		}
	}

	return {
		executeTask,
		getErrorRes,
		getSuccessRes,
	};
}

export function useUpdateItemPosTask() {
	function getSuccessRes(): UpdateItemPosResp {
		return {
			name: 'updateItemPos',
			timestamp: +new Date(),
			status: {
				name: 'success',
				payload: {},
			},
		};
	}

	function getErrorRes(message?: string): UpdateItemPosResp {
		return {
			name: 'updateItemPos',
			timestamp: +new Date(),
			status: {
				name: 'error',
				message: message ?? 'Error on update item position',
			},
		};
	}

	function executeTask(task: UpdateItemPosTask) {
		try {
			const successRes = listRepo.updateSelectedItemPos(task.payload.oldPos, task.payload.newPos);
			const resVariant = successRes ? getSuccessRes() : getErrorRes();

			tasksRes.addResponse(task.key, resVariant);
		} catch (error) {
			logger.error(error);
			tasksRes.addResponse(task.key, getErrorRes('Unknown Error'));
		}
	}

	return {
		executeTask,
		getErrorRes,
		getSuccessRes,
	};
}

export type SuccessStatus<T> = {
	name: 'success';
	payload: T;
};

export type ErrorStatus = {
	name: 'error';
	message: string;
};

export type AddItemResp = {
	name: 'addItem';
	timestamp: number;
	status: SuccessStatus<{}> | ErrorStatus;
};

export type SelectItemResp = {
	name: 'selectItem';
	timestamp: number;
	status: SuccessStatus<{}> | ErrorStatus;
};

export type UpdateItemPosTask = {
	name: 'updateItemPos';
	timestamp: number;
	status: SuccessStatus<{}> | ErrorStatus;
};

export type TasksResponse = AddItemResp | SelectItemResp | UpdateItemPosTask;

const _tasksResponse = new Map<string, TasksResponse>();

export function useTasksResponse() {
	function getResponse(key: string) {
		return _tasksResponse.get(key);
	}

	function addResponse(key: string, response: TasksResponse) {
		_tasksResponse.set(key, response);
	}

	function removeResponse(key: string) {
		_tasksResponse.delete(key);
	}

	return {
		getResponse,
		addResponse,
		removeResponse,
	};
}

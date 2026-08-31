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

export type UpdateItemPosResp = {
	name: 'updateItemPos';
	timestamp: number;
	status: SuccessStatus<{}> | ErrorStatus;
};

export type TasksResponse = AddItemResp | SelectItemResp | UpdateItemPosResp;

const _tasksResponse = new Map<string, TasksResponse>();

const RESPONSE_TTL = 5 * 60000;

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

	function cleanUpOldResponses() {
		_tasksResponse.forEach((resp, key) => {
			const exceedTime = Date.now() - resp.timestamp > RESPONSE_TTL;

			if (exceedTime) {
				console.log(`Old response removed: ${key} - ${resp.name}`);

				_tasksResponse.delete(key);
			}
		});
	}

	return {
		getResponse,
		addResponse,
		removeResponse,
		cleanUpOldResponses,
	};
}

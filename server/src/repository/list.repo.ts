import { logger } from '@/config';
import { isNum, LIST_LENGTH, PAGE_LIMIT } from '@/common';

let list: Int32Array<ArrayBuffer>;
const selectedIndexes = new Set<number>();
const selectedOrder: number[] = [];

const maxLength = LIST_LENGTH + 100000;
let currentLength = LIST_LENGTH;

export type PaginatedResult = {
	hasMore: boolean;
	totalPages: number;
	nextCursor: number | null;
	items: Array<{ idx: number; id: number }>;
};

export function resetList() {
	list = new Int32Array(maxLength);
	selectedOrder.length = 0;
	selectedIndexes.clear();
	currentLength = LIST_LENGTH;

	for (let i = 0; i < LIST_LENGTH; i++) {
		list[i] = i + 1;
	}
}

export function getPaginatedList(cursor: number | null, searchId?: number): PaginatedResult {
	const result: Array<{ idx: number; id: number }> = [];

	const startIndex = cursor !== null ? cursor - 1 : currentLength - 1;

	for (let i = startIndex; i >= 0; i--) {
		if (selectedIndexes.has(i)) continue;

		const id = list[i];

		if (searchId && !id.toString().includes(searchId.toString())) continue;

		result.push({ id, idx: i });

		if (result.length === PAGE_LIMIT) break;
	}

	const nextCursor = result.length > 0 ? result[result.length - 1].idx : null;

	const totalLeftItems = currentLength - selectedIndexes.size;
	const totalPages = Math.ceil(totalLeftItems / PAGE_LIMIT);

	return {
		totalPages,
		items: result,
		nextCursor: nextCursor,
		hasMore: nextCursor !== null && nextCursor > 0,
	};
}

export function getSelectedList(cursor: number | null, searchId?: number): PaginatedResult {
	const targetList = isNum(searchId)
		? selectedOrder.filter((idx) => list[idx].toString().includes(searchId.toString()))
		: selectedOrder;

	const startIndex = cursor !== null ? cursor + 1 : 0;
	const result = targetList.slice(startIndex, startIndex + PAGE_LIMIT + 1);
	const hasMore = result.length > PAGE_LIMIT;

	if (hasMore) result.pop();

	const totalPages = Math.ceil(targetList.length / PAGE_LIMIT);
	const nextCursor = result.length > 0 ? startIndex + result.length - 1 : null;

	const formattedItems = result.map((idx) => ({
		idx,
		id: list[idx],
	}));

	return {
		hasMore,
		totalPages,
		items: formattedItems,
		nextCursor,
	};
}

export function addItemToList(id: number) {
	try {
		if (currentLength >= maxLength) {
			logger.error('max length exceeded');
			return { success: false };
		}

		const exists = list.subarray(0, currentLength).includes(id);
		if (exists) return { success: false };

		list[currentLength] = id;
		currentLength++;

		return { success: true, idx: currentLength };
	} catch (error) {
		logger.error(error);
		return { success: false };
	}
}

export function selectItem(idx: number) {
	if (idx === 999997) return false;

	if (selectedIndexes.has(idx)) return true;
	selectedIndexes.add(idx);
	selectedOrder.push(idx);

	return true;
}

export function flushSelectedItems() {
	selectedIndexes.clear();
	selectedOrder.length = 0;
}

export function updateSelectedItemPos(oldPos: number, newPos: number) {
	try {
		if (oldPos === newPos) return true;

		if (selectedOrder[oldPos] === undefined || selectedOrder[newPos] === undefined) {
			return false;
		}

		const [movedItem] = selectedOrder.splice(oldPos, 1);

		if (movedItem) {
			selectedOrder.splice(newPos, 0, movedItem);
		}

		return true;
	} catch (error) {
		logger.error(error);
		return false;
	}
}

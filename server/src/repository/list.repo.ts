import { logger } from '@/config';
import { isNum, LIST_LENGTH, PAGE_LIMIT } from '@/common';

export type SelectedItem = { idx: number; id: number };
export type PaginatedResult = {
	items: number[];
	hasMore: boolean;
};
export type SelectedPaginatedResult = {
	items: SelectedItem[];
	hasMore: boolean;
};

let list = Array.from({ length: LIST_LENGTH }, (_, i) => i + 1);

const selectedList: SelectedItem[] = [];
const selectedRowIdx = new Set<number>();

export function resetList() {
	list = Array.from({ length: LIST_LENGTH }, (_, i) => i + 1);
}

export function getPaginatedList(page: number, searchId?: number): PaginatedResult {
	const chunk: number[] = [];
	let skippedCount = 0;

	const offset = (page - 1) * PAGE_LIMIT;

	for (let i = 0; i < list.length; i++) {
		if (selectedRowIdx.has(i)) continue;

		const id = list[i];

		if (searchId && searchId !== id) continue;

		if (skippedCount < offset) {
			skippedCount++;
			continue;
		}

		chunk.push(id);

		if (chunk.length === PAGE_LIMIT + 1) break;
	}

	const hasMore = chunk.length > PAGE_LIMIT;
	if (hasMore) chunk.pop();

	return {
		items: chunk,
		hasMore,
	};
}

export function getSelectedList(page: number, searchId?: number): SelectedPaginatedResult {
	const offset = (page - 1) * PAGE_LIMIT;
	const sliceLimit = offset + PAGE_LIMIT + 1;

	if (isNum(searchId)) {
		const filtered = selectedList.filter((v) => v.id === searchId);
		const chunk = filtered.slice(offset, sliceLimit);

		const hasMore = chunk.length > PAGE_LIMIT;
		if (hasMore) chunk.pop();

		return {
			items: chunk,
			hasMore,
		};
	}

	const chunk = selectedList.slice(offset, sliceLimit);

	const hasMore = chunk.length > PAGE_LIMIT;
	if (hasMore) chunk.pop();

	return {
		items: chunk,
		hasMore,
	};
}

export function addItemToList(id: number) {
	try {
		list.push(id);
		return true;
	} catch (error) {
		logger.error(error);
		return false;
	}
}

export function selectItem(id: number, idx: number) {
	if (list[idx] !== id) return false;

	selectedRowIdx.add(idx);
	selectedList.push({ id, idx });

	return true;
}

export function flushSelectedItems() {
	selectedRowIdx.clear();
	selectedList.length = 0;
}

export function updateSelectedItemPos(oldPos: number, newPos: number) {
	try {
		if (oldPos === newPos) return true;

		if (selectedList[oldPos] === undefined || selectedList[newPos] === undefined) {
			return false;
		}

		const [movedItem] = selectedList.splice(oldPos, 1);

		if (movedItem) {
			selectedList.splice(newPos, 0, movedItem);
		}

		return true;
	} catch (error) {
		logger.error(error);
		return false;
	}
}

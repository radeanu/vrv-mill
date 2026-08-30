import { isNum } from '@/common';

const list = Array.from({ length: 1_000_000 }, (_, i) => i + 1);
const selectedList: number[] = [];

export function getList(limit: number, offset: number, searchId?: number): number[] {
	return list
		.filter((v) => {
			const isSelected = selectedList.includes(v);
			if (isSelected) return false;

			return isNum(searchId) ? v === searchId : true;
		})
		.slice(offset, offset + limit);
}

export function getSelectedList(limit: number, offset: number, searchId?: number): number[] {
	if (isNum(searchId)) {
		return selectedList.filter((v) => v === searchId).slice(offset, offset + limit);
	}

	return selectedList.slice(offset, offset + limit);
}

export function addItemToList(id: number) {
	return list.push(id);
}

export function selectItem(id: number) {
	return selectedList.push(id);
}

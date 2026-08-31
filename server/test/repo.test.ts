import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { listRepo } from '@/repository';
import { LIST_LENGTH, PAGE_LIMIT } from '@/common';

describe('list', () => {
	afterEach(() => {
		listRepo.resetList();
		listRepo.flushSelectedItems();
	});

	it('add new item to list', () => {
		listRepo.addItemToList(29);

		const lastPageNr = Math.ceil((LIST_LENGTH + 1) / PAGE_LIMIT);
		const lastPage = listRepo.getPaginatedList(lastPageNr);

		assert.equal(29, lastPage.items.at(-1));
	});

	it('select item 9 at idx 8', () => {
		const res = listRepo.selectItem(9, 8);
		const targetPage = listRepo.getPaginatedList(1);
		const selectedList = listRepo.getSelectedList(1).items.map((v) => v.id);

		console.log({ res, selectedList });
		assert.deepEqual(
			targetPage.items,
			[1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
		);
		assert.deepEqual(selectedList, [9]);
	});
});

describe('update selected item pos', () => {
	beforeEach(() => {
		[1, 2, 3, 4, 5].forEach((v, idx) => {
			listRepo.selectItem(v, idx);
		});
	});

	afterEach(() => {
		listRepo.flushSelectedItems();
	});

	it('apply new pos for id=2 at idx=1 to idx=4', () => {
		const result = listRepo.updateSelectedItemPos(1, 4);
		assert.equal(result, true);

		const listAfter = listRepo.getSelectedList(1).items.map((v) => v.id);
		assert.deepEqual(listAfter, [1, 3, 4, 5, 2]);
	});

	it('return false for invalid positions', () => {
		const case1 = listRepo.updateSelectedItemPos(1, 10);
		assert.equal(case1, false);

		const case2 = listRepo.updateSelectedItemPos(-4, 4);
		assert.equal(case2, false);
	});

	it('return true for same positions', () => {
		const result = listRepo.updateSelectedItemPos(1, 1);
		assert.equal(result, true);
	});
});

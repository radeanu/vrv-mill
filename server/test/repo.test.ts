import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { listRepo } from '@/repository';

describe('list', () => {
	beforeEach(() => {
		listRepo.resetList(10);
		listRepo.flushSelectedItems();
	});

	it('add new item to list', () => {
		listRepo.addItemToList(29);

		const firstPage = listRepo.getPaginatedList(null);

		assert.equal(29, firstPage.items.at(0)?.id);
	});

	it('select id 3 at index 2', () => {
		listRepo.selectItem(2);
		const targetPage = listRepo.getPaginatedList(null).items.map((v) => v.id);
		const selectedList = listRepo.getSelectedList(null).items.map((v) => v.idx);

		assert.deepEqual(targetPage, [10, 9, 8, 7, 6, 5, 4, 2, 1]);
		assert.deepEqual(selectedList, [2]);
	});
});

describe.only('update selected item pos', () => {
	beforeEach(() => {
		listRepo.resetList(10);

		listRepo.flushSelectedItems();
		[1, 2, 3, 4, 5].forEach((_, idx) => {
			listRepo.selectItem(idx);
		});
	});

	it('apply new pos for id=1 at idx=0 to idx=4', () => {
		const result = listRepo.updateSelectedItemPos(0, 4);
		assert.equal(result, true);

		const listAfter = listRepo.getSelectedList(null).items.map((v) => v.id);

		assert.deepEqual(listAfter, [2, 3, 4, 5, 1]);
	});

	it('with searchId=1 apply new pos for id=11 at idx=1 to idx=2', () => {
		listRepo.addItemToList(11);
		listRepo.addItemToList(12);

		listRepo.selectItem(10);
		listRepo.selectItem(11);

		// list =    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
		// listIdx = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

		// selected =    [1, 2, 3, 4, 5, 11, 12]
		// selectedIdx = [0, 1, 2, 3, 4, 10, 11]

		// selectedIdsWithSearch = [1, 11, 12]
		// selectedIdxWithSearch = [0, 1, 2]

		const result = listRepo.updateSelectedItemPos(1, 2, 1);
		assert.equal(result, true);

		const listAfter = listRepo.getSelectedList(null).items.map((v) => v.id);

		assert.deepEqual(listAfter, [1, 2, 3, 4, 5, 12, 11]);
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

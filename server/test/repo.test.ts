import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { listRepo } from '@/repository';

describe('list', () => {
	beforeEach(() => {
		listRepo.resetList();
		listRepo.flushSelectedItems();
	});

	it('add new item to list', () => {
		listRepo.addItemToList(29);

		const firstPage = listRepo.getPaginatedList(null);

		assert.equal(29, firstPage.items.at(0)?.id);
	});

	it('select id 999996 at index 999995', () => {
		listRepo.selectItem(999995);
		const targetPage = listRepo.getPaginatedList(null).items.map((v) => v.id);
		const selectedList = listRepo.getSelectedList(null).items.map((v) => v.idx);

		assert.deepEqual(
			targetPage,
			[
				1000000, 999999, 999998, 999997, 999995, 999994, 999993, 999992, 999991, 999990, 999989,
				999988, 999987, 999986, 999985, 999984, 999983, 999982, 999981, 999980,
			],
		);
		assert.deepEqual(selectedList, [999995]);
	});
});

describe('update selected item pos', () => {
	beforeEach(() => {
		listRepo.flushSelectedItems();
		[1, 2, 3, 4, 5].forEach((_, idx) => {
			listRepo.selectItem(idx);
		});
	});

	it('apply new pos for id=1 at idx=1 to idx=4', () => {
		const result = listRepo.updateSelectedItemPos(1, 4);
		assert.equal(result, true);

		const listAfter = listRepo.getSelectedList(null).items.map((v) => v.idx);

		assert.deepEqual(listAfter, [0, 2, 3, 4, 1]);
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

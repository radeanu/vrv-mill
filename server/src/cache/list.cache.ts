import { listRepo } from '@/repository';
import type { PaginatedResult } from '@/repository/list.repo';

type CachedPage = {
	items: PaginatedResult;
	expiresAt: number;
};

const PAGE_TTL = 15_000;
const cachedPages = new Map<number, CachedPage>();

export function getOrCreatePage(cursor: number): PaginatedResult {
	const cachedP = cachedPages.get(cursor);

	if (cachedP) {
		cachedP.expiresAt = Date.now() + PAGE_TTL;

		return cachedP.items;
	}

	const listItems = listRepo.getPaginatedList(cursor);
	cachedPages.set(cursor, {
		items: listItems,
		expiresAt: Date.now() + PAGE_TTL,
	});

	return listItems;
}

export function cleanUpCachedPages() {
	cachedPages.forEach((page, key) => {
		const expired = Date.now() > page.expiresAt;

		if (expired) {
			console.log(`Cached page removed for cursor: ${key}`);
			cachedPages.delete(key);
		}
	});
}

export function clearCachedPages() {
	cachedPages.clear();
}

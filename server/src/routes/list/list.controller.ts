import type { NextFunction, Request, Response } from 'express';

import { listRepo } from '@/repository';
import { getOrCreatePage } from '@/cache/list.cache';

import schema from './list.schema';

export async function getList(req: Request, res: Response, next: NextFunction) {
	try {
		const queryValues = await schema.getList.validate(req.query, {
			abortEarly: false,
			stripUnknown: true,
		});

		if (queryValues.id !== undefined) {
			const pageData = listRepo.getPaginatedList(queryValues.page, queryValues.id);
			return res.status(200).json(pageData);
		}

		const cachedPage = getOrCreatePage(queryValues.page);

		return res.status(200).json(cachedPage);
	} catch (error) {
		next(error);
	}
}

// export async function getSelectedList(req: Request, res: Response, next: NextFunction) {
// 	try {
// 		const queryValues = await schema.getList.validate(req.query, {
// 			abortEarly: false,
// 			stripUnknown: true,
// 		});

// 		const selectedList = listRepo.getSelectedList(queryValues.limit, queryValues.page, queryValues.id);

// 		return res.status(200).json(selectedList);
// 	} catch (error) {
// 		next(error);
// 	}
// }

// export async function addItemToList(req: Request, res: Response, next: NextFunction) {
// 	try {
// 		const queryValues = await schema.getList.validate(req.query, {
// 			abortEarly: false,
// 			stripUnknown: true,
// 		});

// 		const list = listRepo.getList(queryValues.limit, queryValues.page, queryValues.id);

// 		return res.status(200).json(list);
// 	} catch (error) {
// 		next(error);
// 	}
// }

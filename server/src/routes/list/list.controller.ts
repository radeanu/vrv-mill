import type { NextFunction, Request, Response } from 'express';

import schema from './list.schema';
import { listRepo } from '@/repository';

export async function getList(req: Request, res: Response, next: NextFunction) {
	try {
		const queryValues = await schema.getList.validate(req.query, {
			abortEarly: false,
			stripUnknown: true,
		});

		const list = listRepo.getList(queryValues.limit, queryValues.offset, queryValues.id);

		return res.status(200).json(list);
	} catch (error) {
		next(error);
	}
}

export async function getSelectedList(req: Request, res: Response, next: NextFunction) {
	try {
		const queryValues = await schema.getList.validate(req.query, {
			abortEarly: false,
			stripUnknown: true,
		});

		const selectedList = listRepo.getSelectedList(queryValues.limit, queryValues.offset, queryValues.id);

		return res.status(200).json(selectedList);
	} catch (error) {
		next(error);
	}
}

export async function addItemToList(req: Request, res: Response, next: NextFunction) {
	try {
		const queryValues = await schema.getList.validate(req.query, {
			abortEarly: false,
			stripUnknown: true,
		});

		const list = listRepo.getList(queryValues.limit, queryValues.offset, queryValues.id);

		return res.status(200).json(list);
	} catch (error) {
		next(error);
	}
}

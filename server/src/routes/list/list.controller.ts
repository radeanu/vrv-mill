import type { NextFunction, Request, Response } from 'express';

import { listRepo } from '@/repository';
import { IDEMPOTENCY_KEY } from '@/common';
import { getOrCreatePage } from '@/cache/list.cache';
import { useTaskRegister } from '@/tasks/tasks.register';

import schema from './list.schema';

const taskRegister = useTaskRegister();

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

export async function addItemToList(req: Request, res: Response, next: NextFunction) {
	try {
		const payload = await schema.addItemToList.validate(
			{
				...req.body,
				key: req.headers?.[IDEMPOTENCY_KEY],
			},
			{ abortEarly: false, stripUnknown: true },
		);

		taskRegister.addTask({
			name: 'addItem',
			key: payload.key,
			payload: { id: payload.id },
		});

		return res.status(202).send();
	} catch (error) {
		next(error);
	}
}

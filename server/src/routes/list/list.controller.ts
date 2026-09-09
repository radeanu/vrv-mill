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

		if (queryValues.id !== undefined || queryValues.cursor === null) {
			const pageData = listRepo.getPaginatedList(queryValues.cursor, queryValues.id);
			return res.status(200).json(pageData);
		}

		const cachedPage = getOrCreatePage(queryValues.cursor);

		return res.status(200).json(cachedPage);
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

		const selectedList = listRepo.getSelectedList(queryValues.cursor, queryValues.id);

		return res.status(200).json(selectedList);
	} catch (error) {
		next(error);
	}
}

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

export async function selectItem(req: Request, res: Response, next: NextFunction) {
	try {
		const payload = await schema.selectItem.validate(
			{
				...req.body,
				key: req.headers?.[IDEMPOTENCY_KEY],
			},
			{ abortEarly: false, stripUnknown: true },
		);

		taskRegister.addTask({
			name: 'selectItem',
			key: payload.key,
			payload: { idx: payload.idx },
		});

		return res.status(202).send();
	} catch (error) {
		next(error);
	}
}

export async function updateItemOrder(req: Request, res: Response, next: NextFunction) {
	try {
		const payload = await schema.updateItemOrder.validate(
			{
				...req.body,
				key: req.headers?.[IDEMPOTENCY_KEY],
			},
			{ abortEarly: false, stripUnknown: true },
		);

		taskRegister.addTask({
			name: 'updateItemPos',
			key: payload.key,
			payload: {
				oldPos: payload.oldPos,
				newPos: payload.newPos,
				searchId: payload.searchId,
			},
		});

		return res.status(202).send();
	} catch (error) {
		next(error);
	}
}

export async function resetAllData(req: Request, res: Response, next: NextFunction) {
	try {
		listRepo.resetList();

		return res.status(200).send();
	} catch (error) {
		next(error);
	}
}

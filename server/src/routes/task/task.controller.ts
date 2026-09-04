import type { NextFunction, Request, Response } from 'express';

import { useTasksStatus } from '@/tasks/tasks.status';

import schema from './task.schema';

const tasksStatus = useTasksStatus();

export async function getStatuses(req: Request, res: Response, next: NextFunction) {
	try {
		const tasksList = await schema.getStatuses.validate(req.body, {
			abortEarly: false,
			stripUnknown: true,
		});

		const tasksStatuses = tasksList.map((key) => {
			const task = tasksStatus.get(key);

			return {
				key,
				task,
			};
		});

		return res.status(200).json(tasksStatuses);
	} catch (error) {
		next(error);
	}
}

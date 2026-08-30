import { ValidationError } from 'yup';
import type { Request, Response, NextFunction, Express } from 'express';

import { logger } from '@/config';

export function useErrorHandler(app: Express) {
	process.on('uncaughtException', (error) => {
		logger.error(error);
	});

	app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		if (err instanceof ValidationError) {
			return res.status(400).json({ message: err.errors[0] });
		}

		logger.error(err);

		return res.status(500).json({ message: 'Unknown error' });
	});
}

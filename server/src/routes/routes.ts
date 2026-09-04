import { type Express } from 'express';

import { useErrorHandler } from '@/config';

import listRoutes from './list/list.routes';
import taskRoutes from './task/task.routes';

export default function (app: Express) {
	app.use('/api/v1/list', listRoutes);
	app.use('/api/v1/task', taskRoutes);

	useErrorHandler(app);
}

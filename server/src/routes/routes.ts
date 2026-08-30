import { type Express } from 'express';

import { useErrorHandler } from '@/config';

import listRoutes from './list/list.routes';

export default function (app: Express) {
	app.use('/api/v1/list', listRoutes);

	useErrorHandler(app);
}

import express from 'express';
import { createServer } from 'http';

import { listRepo } from '@/repository';
import useRoutes from '@/routes/routes';
import { env, useCors, useBodyParser, useCompression } from '@/config';

import '@/tasks/tasks.timer';

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

useCors(app);
useCompression(app);
useBodyParser(app);
useRoutes(app);

const server = createServer(app);

server.listen(env.PORT, env.HOST, () => {
	listRepo.resetList();
	console.log(`Listen http://${env.HOST}:${env.PORT}`);
});

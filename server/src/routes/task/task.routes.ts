import express from 'express';

import * as taskCtrl from './task.controller';

const router = express.Router();

router.post('/get-status', taskCtrl.getStatuses);

export default router;

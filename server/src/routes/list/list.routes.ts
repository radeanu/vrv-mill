import express from 'express';

import * as listCtrl from './list.controller';

const router = express.Router();

router.get('/', listCtrl.getList);
// router.get('/selected', listCtrl.getSelectedList);

export default router;

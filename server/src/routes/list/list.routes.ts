import express from 'express';

import * as listCtrl from './list.controller';

const router = express.Router();

router.get('/', listCtrl.getList);
router.get('/selected', listCtrl.getSelectedList);

router.post('/add', listCtrl.addItemToList);
router.post('/select-item', listCtrl.selectItem);
router.post('/update-order', listCtrl.updateItemOrder);

export default router;

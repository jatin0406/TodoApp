import express from 'express';
const router = express.Router();

import { add, get, update, deleteTodo, deleteAll, markAll, unMarkAll } from '../controller/todo.js';

router.post('/add', add);
router.get('/get/:userID', get);
router.patch('/update', update);
router.delete('/delete/:todoID', deleteTodo);
router.delete('/delete-all/:userID', deleteAll);
router.patch('/mark-all/:userID', markAll);
router.patch('/unmark-all/:userID', unMarkAll);

export default router;
import express from 'express';
const router = express.Router();

import { signUp, signIn, verifyToken } from '../controller/auth.js';

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.get('/verify-token/:token', verifyToken);

export default router;
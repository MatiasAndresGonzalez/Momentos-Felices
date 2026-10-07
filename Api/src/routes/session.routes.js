import { Router } from 'express';
import { refreshSession, logoutSession } from '../controllers/session.controller.js';
const router = Router();
router.post('/refresh', refreshSession);
router.post('/logout', logoutSession);
export default router;

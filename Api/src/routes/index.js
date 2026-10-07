import { Router } from 'express';
import statusRoutes from './status.routes.js';
import clientRoutes from './client.routes.js';
import AdminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import sessionRoutes from './session.routes.js';

const router = Router();

router.use('/estado', statusRoutes);
router.use('/client', clientRoutes);
router.use('/admin', AdminRoutes);
router.use('/auth', authRoutes);
router.use('/auth', sessionRoutes);
router.use('/products', productRoutes);

export default router;

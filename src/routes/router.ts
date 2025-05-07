import { Router } from 'express';
import productRouter from './productRoutes';
import categoryRouter from './categoryRoute';
import authRoute from './authRoute';
const router = Router();

router.use('/products', productRouter);
router.use('/auth', authRoute);
router.use('/categories', categoryRouter);
export default router;

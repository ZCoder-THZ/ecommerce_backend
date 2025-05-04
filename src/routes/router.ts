import { Router } from 'express';
import productRouter from './productRoutes';
import authRoute from './authRoute';
const router = Router();

router.use('/products', productRouter);
router.use('/auth', authRoute);
export default router;

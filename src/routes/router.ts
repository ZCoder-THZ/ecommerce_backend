import { Router } from 'express';
import productRouter from './productRoutes';

const router = Router();

router.use('/products', productRouter);

export default router;

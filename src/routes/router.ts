// src/routes/router.ts
import { Router } from 'express';
import productRouter from './productRoutes';
import categoryRouter from './categoryRoute';
import authRoute from './authRoute';
import orderRouter from './orderRoute'; // <-- Import the new order router

const router = Router();

router.use('/products', productRouter);
router.use('/auth', authRoute);
router.use('/categories', categoryRouter);
router.use('/orders', orderRouter); // <-- Add the order routes

export default router;
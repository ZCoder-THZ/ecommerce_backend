// src/routes/orderRoute.ts
import { Router } from 'express';
// Import the specific handler functions using named imports
import { createOrderHandler, getOrderByIdHandler, getOrdersHandler } from '../controllers/orderController';
// import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware'; // Optional

const orderRouter = Router();

// POST /orders - Create a new order (Checkout)
// Use the imported handler functions directly
orderRouter.post('/', createOrderHandler).get('/', getOrdersHandler);

// GET /orders/:id - Get a specific order by ID
// Use the imported handler functions directly
orderRouter.get('/:id', getOrderByIdHandler);

export default orderRouter;
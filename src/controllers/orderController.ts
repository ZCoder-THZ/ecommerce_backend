
import { Request, Response, NextFunction } from 'express';
import orderService from '../services/orderService';

import { OrderCreateInput } from '../schemas/order.schema';
import { formatZodErrorsDetailed } from '../utils/error-formatter';

import { createOrderDto } from '../dtos/order.dto';


export const createOrderHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const orderDto = createOrderDto();


        const validationResult = orderDto.safeParse(req.body);


        if (!validationResult.success) {
            // Send formatted error response
            res.status(400).json(formatZodErrorsDetailed(validationResult.error));
            return; // Exit the function
        }

        const orderInput: OrderCreateInput = validationResult.data;

        // 5. Proceed with the service call using the validated data
        const newOrder = await orderService.createOrder(orderInput);
        res.status(201).json(newOrder);

    } catch (error) {
        // Pass errors to Express error handling middleware
        next(error);
    }
};


export const getOrderByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orderId = parseInt(req.params.id, 10);
        if (isNaN(orderId)) {
            res.status(400).json({ message: "Invalid order ID format." });
            return;
        }

        const order = await orderService.getOrderById(orderId);
        if (!order) {
            res.status(404).json({ message: "Order not found." });
            return;
        }
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }


};

export const getOrdersHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const options = {
            // skip: ...,
            // take: ...
        };
        const orders = await orderService.getAllOrders(options);
        res.status(200).json(orders);
    } catch (error) {
        next(error); // Pass errors to global error handler
    }
};
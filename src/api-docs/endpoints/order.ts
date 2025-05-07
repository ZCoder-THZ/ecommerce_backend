// src/api-docs/endpoints/order.ts
import { OrderCreateSchema, OrderSchema, OrderItemCreateSchema } from '../../schemas/order.schema';
import { registry } from '../registry';
import z from 'zod'
export function registerOrderPaths() {
    registry.register('OrderItemCreate', OrderItemCreateSchema);
    registry.register('OrderCreate', OrderCreateSchema);
    registry.register('Order', OrderSchema);

    registry.registerPath({
        method: 'post',
        path: '/orders',
        description: 'Create a new order (checkout)',
        tags: ['Orders'],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: { $ref: '#/components/schemas/OrderCreate' },
                },
            },
        },
        responses: {
            201: {
                description: 'Order created successfully',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Order' },
                    },
                },
            },
            400: { description: 'Invalid request payload' },
            409: { description: 'Stock conflict (e.g., item not found or insufficient stock)' },
            500: { description: 'Internal server error' },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/orders/{id}',
        description: 'Get an order by its ID',
        tags: ['Orders'],
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'integer' }, // Prisma IDs are numbers (serial)
                description: 'Order ID',
            },
        ],
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Order' },
                    },
                },
            },
            400: { description: 'Invalid Order ID' },
            404: { description: 'Order not found' },
            500: { description: 'Internal server error' },
        },
    });
    registry.registerPath({
        method: 'get',
        path: '/orders',
        description: 'Get a list of all orders',
        summary: 'Retrieve all orders (Admin access recommended)', // Add summary
        tags: ['Orders'],
        // TODO: Add parameters for pagination (query params: page, limit)
        responses: {
            200: {
                description: 'A list of orders',
                content: {
                    'application/json': {
                        // Use OrderSchema or create a summarized OrderListSchema
                        schema: z.array(OrderSchema), // Adjust if using a summary schema
                    },
                },
            },
            // Add 401/403 responses once auth is added
            500: { description: 'Internal server error' },
        },
    });
}
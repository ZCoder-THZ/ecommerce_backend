// src/schemas/order.schema.ts
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const OrderItemCreateSchema = z.object({
    stockId: z.number().int().positive({ message: "Stock ID must be a positive integer" }),
    quantity: z.number().int().positive({ message: "Quantity must be a positive integer" }),
});

export const OrderCreateSchema = z.object({
    userId: z.string().cuid({ message: "Invalid User ID format" }), // Assuming CUID from your User schema
    paymentMethodId: z.number().int().positive({ message: "Payment Method ID must be a positive integer" }),
    shippingAddress: z.string().min(1, { message: "Shipping address is required" }),
    billingAddress: z.string().min(1, { message: "Billing address is required" }),
    items: z.array(OrderItemCreateSchema).min(1, { message: "Order must contain at least one item" }),
});

export const OrderSchema = OrderCreateSchema.extend({
    id: z.number().int(),
    orderDate: z.date(),
    totalAmount: z.number(),
    paymentStatus: z.string(), // You might want an enum for this: e.g., 'PENDING', 'PAID', 'FAILED'
    orderStatus: z.string().optional().nullable(), // e.g., 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
    sailDate: z.date().optional().nullable(),
    deliverySteps: z.any().optional().nullable(), // Or a more specific JSON schema
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type OrderItemCreateInput = z.infer<typeof OrderItemCreateSchema>;
export type OrderCreateInput = z.infer<typeof OrderCreateSchema>;
export type Order = z.infer<typeof OrderSchema>;
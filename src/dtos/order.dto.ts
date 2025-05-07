// src/dtos/order.dto.ts
import { z } from 'zod';
import { BaseDto } from './base.dto'; // Import the base DTO class
import { OrderCreateSchema } from '../schemas/order.schema'; // Import the Zod schema for order creation

// Define the type based on the Zod schema's output
export type CreateOrderDtoType = z.output<typeof OrderCreateSchema>;

// Create a DTO class specifically for order creation
export class OrderCreateDto extends BaseDto<CreateOrderDtoType> {
    constructor() {
        // Pass the specific Zod schema to the base class constructor
        super(OrderCreateSchema);
    }
}

// Export a factory function to easily create instances of the DTO
export const createOrderDto = () => new OrderCreateDto();
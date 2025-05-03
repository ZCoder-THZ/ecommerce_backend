import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);

// Original Product Schema
export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    categoryId: z.number(),
    createdAt: z.string().transform((val) => new Date(val)),
    updatedAt: z.string().transform((val) => new Date(val)),
    statusId: z.number(),
});

// Product Update Schema for PATCH operations
export const ProductUpdateSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    categoryId: z.number().optional(),
    statusId: z.number().optional(),
});

// Separate validation function to check if at least one field is provided
export const validatePartialUpdate = (data: any) => {
    if (Object.keys(data).length === 0) {
        throw new Error("At least one field must be provided for update");
    }
    return data;
};

export const ProductArraySchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
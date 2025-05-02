import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);



export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    imageUrl: z.string().url(),
    categoryId: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    statusId: z.number(),
});

export const ProductArraySchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;

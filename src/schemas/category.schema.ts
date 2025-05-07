import z from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);

const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    iconUrl: z.string().url().optional(),
    createdAt: z.string().transform((val) => new Date(val)),
    updatedAt: z.string().transform((val) => new Date(val)),
});

export const CategoryCreateSchema = z.object({
    name: z.string().min(1),
    iconUrl: z.string().url().optional(),
});

export const CategoryUpdateSchema = z.object({
    name: z.string().optional(),
    iconUrl: z.string().url().optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
});


const CategoryArraySchema = z.array(CategorySchema);

type Category = z.infer<typeof CategorySchema>;
type CategoryArray = z.infer<typeof CategoryArraySchema>;
export type CategoryCreatePayload = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdatePayload = z.infer<typeof CategoryCreateSchema>;

export { Category, CategoryArray, CategorySchema, CategoryArraySchema };
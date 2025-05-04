import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);



export const userSchema = z.object({
    id: z.string().cuid(),
    name: z.string(),
    email: z.string().email(),
    emailVerified: z.date().optional().nullable(),
    image: z.string().url().optional().nullable(),
    role: z.enum(['USER', 'ADMIN']),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});


export const jwtPayloadSchema = z.object({
    sub: z.string(),                  // user ID
    email: z.string().email().optional(),
    role: z.enum(['USER', 'ADMIN']),
    name: z.string().optional(),
    iat: z.number().optional(),
    exp: z.number().optional(),
});

export const registerSchema = userSchema.pick({
    name: true,
    email: true, // ✅ Forces email to be required
    password: true,
});
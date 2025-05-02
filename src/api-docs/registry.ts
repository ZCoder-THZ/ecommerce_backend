// src/docs/registry.ts
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import z from 'zod';
export const registry = new OpenAPIRegistry();
declare module '@asteasolutions/zod-to-openapi' {
    interface ZodOpenApiRegistry {
        Product: z.ZodObject<any>;
    }
}
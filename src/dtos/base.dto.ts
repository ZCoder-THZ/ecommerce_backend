// src/dtos/base.dto.ts
import { z } from 'zod';

/**
 * Base DTO class that provides validation and transformation functionality
 * All specific DTOs will extend this class
 */
export abstract class BaseDto<T> {
    protected schema: z.ZodType<T>;

    constructor(schema: z.ZodType<T>) {
        this.schema = schema;
    }

    /**
     * Validates data against the schema and throws if invalid
     * @param data Input data to validate
     * @returns Validated and transformed data
     */
    parse(data: unknown): T {
        return this.schema.parse(data);
    }

    /**
     * Validates data against the schema without throwing
     * @param data Input data to validate
     * @returns Result object with success status and data/error
     */
    safeParse(data: unknown): z.SafeParseReturnType<unknown, T> {
        return this.schema.safeParse(data);
    }

    /**
     * Converts data to plain object representation
     * @param data Validated data
     * @returns Plain object representation
     */
    toJSON(data: T): Record<string, any> {
        return data as Record<string, any>;
    }
}
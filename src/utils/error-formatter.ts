import { ZodError } from 'zod';

/**
 * Formats Zod validation errors into user-friendly messages
 * @param error The ZodError object
 * @returns A simplified error response
 */
export const formatZodErrors = (error: ZodError) => {
    // Option 1: Return a single combined message
    const messages = error.errors.map(err => {
        // Get the field name from the path
        const field = err.path.join('.');
        return `${field}: ${err.message}`;
    });

    return {
        message: messages.join('. ')
    };
};

/**
 * Formats Zod validation errors into a more detailed structure
 * but still user-friendly
 * @param error The ZodError object
 * @returns Structured error response with field-specific messages
 */
export const formatZodErrorsDetailed = (error: ZodError) => {
    // Option 2: Return structured field-specific errors
    const formattedErrors: Record<string, string> = {};

    error.errors.forEach(err => {
        const field = err.path.join('.') || 'general';
        formattedErrors[field] = err.message;
    });

    return {
        message: 'Validation failed',
        errors: formattedErrors
    };
};

import { registerSchema, loginSchema } from '../../schemas/auth.schema';

import { registry } from '../registry';

export function registerAuthPath() {
    // Register the component first
    registry.register('Register', registerSchema);
    registry.register('Login', loginSchema);
    registry.registerPath({
        method: 'post',
        path: '/auth/register',
        description: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
            required: true,
            content: {
                'application/json': {

                    schema: {
                        $ref: '#/components/schemas/Register' //reference to the schema  registry.register('Product', ProductSchema); up there,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': {
                        schema: registerSchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/auth/login',
        description: 'Login user',
        tags: ['Auth'],
        requestBody: {
            required: true,
            content: {
                'application/json': {

                    schema: {
                        $ref: '#/components/schemas/Login' //reference to the schema  registry.register('Product', ProductSchema); up there,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': {
                        schema: loginSchema,
                    },
                },
            },
        },
    });



}
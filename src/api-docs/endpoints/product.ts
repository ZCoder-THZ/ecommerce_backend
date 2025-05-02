import { ProductSchema } from '../../schemas/product.schema';
import { registry } from '../registry';

export function registerProductPaths() {
    // Register the component first
    registry.register('Product', ProductSchema);

    registry.registerPath({
        method: 'get',
        path: '/products',
        description: 'Get all products',
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': {
                        schema: ProductSchema.array(), // Use the schema directly
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/products/{id}',
        description: 'Get a product by id',
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' },
                description: 'Product ID',
            },
        ],
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': {
                        schema: ProductSchema, // Use the schema directly
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/products',
        description: 'Create a new product',
        requestBody: {
            required: true,
            content: {
                'application/json': {

                    schema: {
                        $ref: '#/components/schemas/Product' //reference to the schema  registry.register('Product', ProductSchema); up there,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Product created successfully',
                content: {
                    'application/json': {
                        schema: ProductSchema,
                    },
                },
            },
        },
    });
}
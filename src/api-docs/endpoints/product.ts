import { ProductSchema } from '../../schemas/product.schema';
import { registry } from '../registry';

export function registerProductPaths() {
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
                        schema: ProductSchema.array(),
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
                        schema: ProductSchema,
                    },
                },
            },
        },
    });
}

// src/docs/paths/product.paths.ts

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

    // Add more product-related endpoints here...
}

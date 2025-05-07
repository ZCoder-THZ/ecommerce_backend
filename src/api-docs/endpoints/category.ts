import { registry } from '../registry';
import { CategorySchema, CategoryCreateSchema, CategoryUpdateSchema } from '../../schemas/category.schema';
export function registerCategoryPaths() {
    // Register the component first
    registry.register('Category', CategorySchema);
    registry.register('CreateCategory', CategoryCreateSchema);
    registry.register('UpdateCategory', CategoryUpdateSchema);

    registry.registerPath({
        method: 'get',
        path: '/categories',
        tags: ['Categories'],
        description: 'Get all categories',
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': {
                        schema: CategorySchema.array(), // Use the schema directly
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/categories/{id}',
        description: 'Get a category by id',
        tags: ['Categories'],
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                schema: {
                    type: 'string',
                },
            },
        ],
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': {
                        schema: CategorySchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/categories',
        description: 'Create a new category',
        tags: ['Categories'],
        requestBody: {
            required: true,
            content: {
                'application/json': {

                    schema: {
                        $ref: '#/components/schemas/CreateCategory' //reference to the schema  registry.register('Product', ProductSchema); up there,
                    },
                }
            }
        },
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': {
                        schema: CategorySchema,
                    },
                },
            },
        },
    })
    registry.registerPath({
        method: 'patch',
        path: '/categories/{id}',
        tags: ['Categories'],
        description: 'Update a category by id',
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' },
                description: 'category ID',
            },
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {

                    schema: {
                        $ref: '#/components/schemas/UpdateCategory' //reference to the schema  registry.register('Product', ProductSchema); up there,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Product updated successfully',
                content: {
                    'application/json': {
                        schema: CategorySchema,
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'delete',
        path: '/categories/{id}',
        tags: ['Categories'],
        description: 'Delete a Category by id',
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                schema: { type: 'string' },
                description: 'Category ID',
            },
        ],
        responses: {
            200: {
                description: 'Successful response',
                content: {
                    'application/json': {
                        schema: CategorySchema, // Use the schema directly
                    },
                },
            },

        },
    });


}
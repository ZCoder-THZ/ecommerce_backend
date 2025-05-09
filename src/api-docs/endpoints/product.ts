// src/api-docs/endpoints/product.ts
import { z } from 'zod';
import {
    ProductSchema,
    ProductImageSchema
} from '../../schemas/product.schema';
import { registry } from '../registry';

export function registerProductPaths() {
    registry.register('Product', ProductSchema);
    registry.register('ProductImageResponse', ProductImageSchema);

    registry.registerPath({
        method: 'get',
        path: '/products',
        tags: ['Products'],
        summary: 'Get all products',
        description: 'Retrieves a list of all available products.',
        responses: {
            200: {
                description: 'A list of products.',
                content: {
                    'application/json': {
                        schema: z.array(ProductSchema),
                    },
                },
            },
            500: { description: 'Internal server error' },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/products/{id}',
        tags: ['Products'],
        summary: 'Get a product by ID',
        description: 'Retrieves detailed information for a specific product.',
        parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the product to retrieve' },
        ],
        responses: {
            200: {
                description: 'Product details.',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } },
            },
            400: { description: 'Invalid Product ID format' },
            404: { description: 'Product not found' },
            500: { description: 'Internal server error' },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/products',
        tags: ['Products'],
        summary: 'Create a new product',
        description: 'Creates a new product. Accepts multipart/form-data including product details (name, description, categoryId, statusId) and an optional main image file.',
        requestBody: {
            required: true,
            content: {
                'multipart/form-data': {
                    schema: {
                        type: 'object',
                        required: ['name', 'description', 'categoryId', 'statusId'],
                        properties: {
                            name: { type: 'string', description: 'Product name' },
                            description: { type: 'string', description: 'Product description' },
                            categoryId: { type: 'integer', description: 'ID of the associated category' },
                            statusId: { type: 'integer', description: 'ID of the product status (e.g., In Stock)' },
                            mainImage: {
                                type: 'string',
                                format: 'binary',
                                description: 'Optional main image file for the product (e.g., .jpg, .png). Field name must be "mainImage".',
                            },
                        },
                    },
                    encoding: {
                        mainImage: { contentType: 'image/jpeg, image/png, image/webp, image/gif' }
                    }
                },
            },
        },
        responses: {
            201: {
                description: 'Product created successfully.',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } },
            },
            400: { description: 'Invalid input data or missing required fields' },
            413: { description: 'File size too large' },
            500: { description: 'Internal server error' },
        },
    });

    registry.registerPath({
        method: 'patch',
        path: '/products/{id}',
        tags: ['Products'],
        summary: 'Update a product',
        description: 'Updates an existing product. Accepts multipart/form-data including fields to update and/or an optional new main image file. At least one field or a new image must be provided.',
        parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the product to update' },
        ],
        requestBody: {
            required: true,
            content: {
                'multipart/form-data': {
                    schema: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'New product name (optional)' },
                            description: { type: 'string', description: 'New product description (optional)' },
                            categoryId: { type: 'integer', description: 'New category ID (optional)' },
                            statusId: { type: 'integer', description: 'New product status ID (optional)' },
                            mainImage: {
                                type: 'string',
                                format: 'binary',
                                description: 'Optional new main image file to replace the existing one. Field name must be "mainImage".',
                            },
                        },
                    },
                    encoding: {
                        mainImage: { contentType: 'image/jpeg, image/png, image/webp, image/gif' }
                    }
                },
            },
        },
        responses: {
            200: {
                description: 'Product updated successfully.',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } },
            },
            400: { description: 'Invalid input data, no data provided, or invalid Product ID' },
            404: { description: 'Product not found' },
            413: { description: 'File size too large' },
            500: { description: 'Internal server error' },
        },
    });

    registry.registerPath({
        method: 'delete',
        path: '/products/{id}',
        tags: ['Products'],
        summary: 'Delete a product by ID',
        description: 'Deletes a product and its associated images.',
        parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the product to delete' },
        ],
        responses: {
            200: {
                description: 'Product deleted successfully.',
                content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Product deleted successfully' } } } } }
            },
            400: { description: 'Invalid Product ID format' },
            404: { description: 'Product not found' },
            500: { description: 'Internal server error' },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/products/{id}/images',
        tags: ['Products'],
        summary: 'Add an additional image to a product',
        description: 'Uploads an image file (using form field name "image") and associates it with the specified product.',
        parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the product to add the image to' },
        ],
        requestBody: {
            required: true,
            content: {
                'multipart/form-data': {
                    schema: {
                        type: 'object',
                        required: ['image'],
                        properties: {
                            image: {
                                type: 'string',
                                format: 'binary',
                                description: 'The image file to upload.',
                            },
                        },
                    },
                    encoding: {
                        image: { contentType: 'image/jpeg, image/png, image/webp, image/gif' }
                    }
                },
            },
        },
        responses: {
            201: {
                description: 'Image added successfully.',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductImageResponse' } } },
            },
            400: { description: 'Invalid input data, missing file (field name "image"), or invalid Product ID' },
            404: { description: 'Product not found' },
            413: { description: 'File size too large' },
            500: { description: 'Internal server error' },
        },
    });

    registry.registerPath({
        method: 'delete',
        path: '/products/{id}/images/{imageId}',
        tags: ['Products'],
        summary: 'Delete a specific product image',
        description: 'Deletes a specific additional image associated with a product using the image\'s unique ID.',
        parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the product (for context)' },
            { name: 'imageId', in: 'path', required: true, schema: { type: 'integer' }, description: 'ID of the product image record to delete' },
        ],
        responses: {
            200: {
                description: 'Image deleted successfully.',
                content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', example: 'Product image deleted successfully.' } } } } }
            },
            400: { description: 'Invalid Product or Image ID format' },
            404: { description: 'Product image not found' },
            500: { description: 'Internal server error' },
        },
    });
}
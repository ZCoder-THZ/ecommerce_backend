// src/docs/openapi.ts
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry';
import { registerProductPaths } from './endpoints/product';
import { registerAuthPath } from './endpoints/auth';
import { registerCategoryPaths } from './endpoints/category';
export function generateOpenAPIDocument() {
  // Register all paths with their respective tags
  registerProductPaths(); // These will use 'Products' tag
  registerAuthPath();   // These will use 'Auth' tag
  registerCategoryPaths()
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Swagger API',
      description: 'API Documentation with grouped endpoints',
    },
    tags: [
      {
        name: 'Products',
        description: 'Operations related to products',
      },
      {
        name: 'Auth',
        description: 'Authentication and authorization operations',
      },
    ],
    externalDocs: {
      description: 'View the raw OpenAPI Specification in JSON format',
      url: '/swagger.json',
    },
  });
}
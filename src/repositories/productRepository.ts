import { prismaClient } from "../lib/prismaClient"
import { Product } from "../schemas/product.schema";
import { Prisma } from '@prisma/client';
class ProductRepository {
    async getAllProducts(): Promise<Product[] | []> {
        return await prismaClient.product.findMany({
            include: {
                category: true,
                stock: true,
                images: true
            }
        })

    }


    async getProductById(id: number): Promise<Product | null> {
        return await prismaClient.product.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                category: true,
                stock: true,
                images: true
            }
        })
    }

    async createProduct(product: Product): Promise<Product> {
        return await prismaClient.product.create({
            data: product
        })
    }

    async delteProductById(id: number): Promise<Product | Error> {

        return await prismaClient.product.delete({
            where: {
                id
            }
        })

    }
    async updateProductById(id: number, productUpdateData: Prisma.ProductUpdateInput): Promise<Product> {
        return await prismaClient.product.update({
            where: {
                id: Number(id) // Ensure ID is a number
            },
            // Pass the partial update data directly to Prisma's data argument
            data: productUpdateData
        }) as unknown as Product; // Keep assertion or refine return type mapping
    }
}

export default new ProductRepository()
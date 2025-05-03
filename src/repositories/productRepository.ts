import { prismaClient } from "../lib/prismaClient"
import { Product } from "../schemas/product.schema";
class ProductRepository {
    async getAllProducts(): Promise<Product[] | []> {
        return await prismaClient.product.findMany()

    }


    async getProductById(id: number): Promise<Product | null> {
        return await prismaClient.product.findUnique({
            where: {
                id: Number(id)
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
    async updateProductById(id: number, product: Product): Promise<Product> {
        return await prismaClient.product.update({
            where: {
                id
            },
            data: product
        })
    }
}

export default new ProductRepository()
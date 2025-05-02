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
}

export default new ProductRepository()
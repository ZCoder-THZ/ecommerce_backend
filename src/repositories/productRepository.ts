import { prismaClient } from "../lib/prismaClient"
class ProductRepository {
    getAllProducts() {
        return prismaClient.product.findMany()

    }
}

export default new ProductRepository()
import productRepository from "../repositories/productRepository";
import { Product } from "../schemas/product.schema";
class ProductService {
    constructor() { }

    getAllProducts() {
        return productRepository.getAllProducts()
    }

    getProductById(id: number) {
        return productRepository.getProductById(id)
    }

    createProduct(product: Product) {
        return productRepository.createProduct(product)
    }
}
export default new ProductService
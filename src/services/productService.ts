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
}
export default new ProductService
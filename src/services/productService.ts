import productRepository from "../repositories/productRepository";
class ProductService {
    constructor() { }

    getAllProducts() {
        return productRepository.getAllProducts()
    }
}
export default new ProductService
import { Request, Response } from "express";
import productService from "../services/productService";

class ProductController {
    public async getAllProducts(req: Request, res: Response) {

        const products = await productService.getAllProducts();

        res.json(products);
    }
    async getProductById(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        const product = await productService.getProductById(id);
        res.json(product);

    }
}

export default new ProductController();

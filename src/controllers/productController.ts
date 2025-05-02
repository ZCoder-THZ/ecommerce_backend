import { Request, Response } from "express";
import productService from "../services/productService";
class ProductController {
    public async getAllProducts(req: Request, res: Response) {
        const products = await productService.getAllProducts();
        res.json(products);
    }
}

export default new ProductController();
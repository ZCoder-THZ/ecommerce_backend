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
    async createProduct(req: Request, res: Response) {

        const product = await req.body;

        await productService.createProduct(product);
        res.status(201).json({ message: "Product created successfully" });
    }
}

export default new ProductController();

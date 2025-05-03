import { Request, Response } from "express";
import productService from "../services/productService";
import { ProductSchema } from "../schemas/product.schema";
class ProductController {
    public async getAllProducts(req: Request, res: Response) {
        try {
            const products = await productService.getAllProducts();

            res.json(products);

        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async getProductById(req: Request, res: Response) {

        try {
            const id = parseInt(req.params.id);
            const product = await productService.getProductById(id);
            res.json(product);
        } catch (error) {
            console.error("Error fetching product:", error);
            res.status(500).json({ message: "Internal server error" });
        }

    }
    async createProduct(req: Request, res: Response) {

        try {
            const product = req.body;
            const newProduct = await productService.createProduct(product);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async deleteProduct(req: Request, res: Response) {

        try {
            const id = parseInt(req.params.id);

            const deletedProduct = await productService.deleteProduct(id);
            console.log(deletedProduct);
            res.status(200).json(deletedProduct);
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    async updateProduct(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const product = req.body;
            const updatedProduct = await productService.updateProduct(id, product);
            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default new ProductController();

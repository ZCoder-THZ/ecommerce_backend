import { Request, Response, NextFunction } from "express";
import productService from "../services/productService";
import { UploadedFile } from "express-fileupload";

import {
    ProductCreateBodySchema,
    ProductUpdateBodySchema,
    ProductCreateBodyInput,
    ProductUpdateBodyInput
} from "../schemas/product.schema";
import { formatZodErrorsDetailed } from "../utils/error-formatter"; // Make sure this path is correct


export const getAllProductsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        next(error); // Pass errors to global error handler
    }
};


export const getProductByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid product ID." });
            return;
        }
        const product = await productService.getProductById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found." });
            return;
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};


export const createProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // 1. Validate request body using the specific schema
        const validationResult = ProductCreateBodySchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json(formatZodErrorsDetailed(validationResult.error));
            return;
        }
        const productBodyInput: ProductCreateBodyInput = validationResult.data;


        const mainImageFile = req.files?.mainImage as UploadedFile | UploadedFile[] | undefined;


        const newProduct = await productService.createProduct(productBodyInput, mainImageFile);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
};

export const deleteProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid product ID." });
            return;
        }

        const deletedProduct = await productService.deleteProduct(id);
        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {

        next(error);
    }
};

export const updateProductHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid product ID." });
            return;
        }


        const validationResult = ProductUpdateBodySchema.safeParse(req.body);
        if (!validationResult.success) {

            res.status(400).json(formatZodErrorsDetailed(validationResult.error));
            return;
        }
        const productUpdateBodyInput: ProductUpdateBodyInput = validationResult.data;


        const mainImageFile = req.files?.mainImage as UploadedFile | UploadedFile[] | undefined;


        if (Object.keys(productUpdateBodyInput).length === 0 && !mainImageFile) {
            res.status(400).json({ message: "No update data or image provided." });
            return;
        }


        const updatedProduct = await productService.updateProduct(id, productUpdateBodyInput, mainImageFile);
        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};


export const addProductImageHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const productId = parseInt(req.params.id);
        if (isNaN(productId)) {
            res.status(400).json({ message: "Invalid product ID." });
            return;
        }

        // Ensure field name 'image' matches the form field name used for upload
        const imageFile = req.files?.image as UploadedFile | UploadedFile[] | undefined;
        if (!imageFile) {
            res.status(400).json({ message: "No image file uploaded (expected field name 'image')." });
            return;
        }

        const newImage = await productService.addProductImage(productId, imageFile);
        res.status(201).json(newImage);
    } catch (error) {
        next(error);
    }
};


export const deleteProductImageHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const imageId = parseInt(req.params.imageId);
        if (isNaN(imageId)) {
            res.status(400).json({ message: "Invalid image ID." });
            return;
        }

        await productService.deleteProductImage(imageId);
        // Send success message or 204 No Content
        res.status(200).json({ message: "Product image deleted successfully." });
        // alt: res.status(204).send();
    } catch (error) {
        next(error);
    }
};


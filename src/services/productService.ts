// src/services/productService.ts
import productRepository from "../repositories/productRepository";
// Import the specific type for the input body data
import { Product, ProductCreateBodyInput, ProductUpdateBodyInput, ProductImage } from "../schemas/product.schema";
import uploadService from "./uploadService";
import { UploadedFile } from "express-fileupload";
import { prismaClient } from "../lib/prismaClient";

class ProductService {
    // Existing methods...
    getAllProducts() {
        return productRepository.getAllProducts()
    }

    getProductById(id: number) {
        return productRepository.getProductById(id)
    }

    // --- Modified createProduct ---
    async createProduct(productBodyData: ProductCreateBodyInput, mainImageFile?: UploadedFile | UploadedFile[]) {
        // Use the specific input type ProductCreateBodyInput
        let imageUrl = '/default-product.png'; // Start with default

        const fileToUpload = Array.isArray(mainImageFile) ? mainImageFile[0] : mainImageFile;

        // If a file is provided, upload it and update imageUrl
        if (fileToUpload) {
            imageUrl = await uploadService.saveFileLocally(fileToUpload, 'products');
        }

        // Construct the payload for the repository
        // It includes fields from productBodyData plus the determined imageUrl
        const productPayload = {
            name: productBodyData.name,
            description: productBodyData.description,
            categoryId: productBodyData.categoryId, // Already coerced to number by Zod schema
            statusId: productBodyData.statusId,   // Already coerced to number by Zod schema
            imageUrl: imageUrl, // Use uploaded or default URL
        };

        // Type assertion might be needed if createProduct expects a specific type
        // but Prisma's create usually accepts compatible data shapes.
        return productRepository.createProduct(productPayload as any); // Using 'as any' for simplicity, refine if needed
    }
    // -----------------------------


    // --- Modified deleteProduct ---
    async deleteProduct(id: number) {
        const product = await productRepository.getProductById(id);
        if (product) {
            // Delete main image
            if (product.imageUrl && !product.imageUrl.includes('/default-product.png')) {
                await uploadService.deleteFileLocal(product.imageUrl);
            }
            // Delete additional images (ProductImage records)
            const additionalImages = await prismaClient.productImage.findMany({ where: { productId: id } });
            for (const img of additionalImages) {
                await uploadService.deleteFileLocal(img.url);
            }
            // Delete ProductImage records from DB (if cascade delete not fully trusted or set)
            await prismaClient.productImage.deleteMany({ where: { productId: id } });
        }
        // Delete the product itself
        return productRepository.delteProductById(id);
    }
    // -----------------------------

    // --- Modified updateProduct ---
    async updateProduct(id: number, productUpdateData: ProductUpdateBodyInput, mainImageFile?: UploadedFile | UploadedFile[]) {
        // Use the specific input type ProductUpdateBodyInput
        // Ensure the types are compatible with what updateProductById expects (likely Partial<Product>)
        const updatePayload: Partial<Product> = { ...productUpdateData };

        const fileToUpload = Array.isArray(mainImageFile) ? mainImageFile[0] : mainImageFile;

        if (fileToUpload) {
            const currentProduct = await productRepository.getProductById(id);
            if (!currentProduct) throw new Error(`Product with ID ${id} not found.`);

            const newImageUrl = await uploadService.saveFileLocally(fileToUpload, 'products');
            updatePayload.imageUrl = newImageUrl;

            if (currentProduct.imageUrl && !currentProduct.imageUrl.includes('/default-product.png')) {
                await uploadService.deleteFileLocal(currentProduct.imageUrl);
            }
        }

        // No need to coerce here if using the Zod schemas with coerce in the controller/DTO
        // if (updatePayload.categoryId !== undefined) updatePayload.categoryId = Number(updatePayload.categoryId);
        // if (updatePayload.statusId !== undefined) updatePayload.statusId = Number(updatePayload.statusId);

        return productRepository.updateProductById(id, updatePayload);
    }
    // -----------------------------

    // --- addProductImage --- (Seems okay)
    async addProductImage(productId: number, imageFile: UploadedFile | UploadedFile[]) {
        // ... (implementation seems correct) ...
        const fileToUpload = Array.isArray(imageFile) ? imageFile[0] : imageFile;
        if (!fileToUpload) {
            throw new Error('No image file provided.');
        }
        // Check if product exists
        const product = await productRepository.getProductById(productId);
        if (!product) {
            throw new Error(`Product with ID ${productId} not found.`);
        }

        const imageUrl = await uploadService.saveFileLocally(fileToUpload, 'products');

        const newProductImage = await prismaClient.productImage.create({
            data: {
                productId: productId,
                url: imageUrl,
            }
        });
        return newProductImage;
    }
    // -----------------------------

    // --- deleteProductImage --- (Seems okay)
    async deleteProductImage(productImageId: number) {
        // ... (implementation seems correct) ...
        const image = await prismaClient.productImage.findUnique({ where: { id: productImageId } });
        if (!image) {
            throw new Error(`Product image with ID ${productImageId} not found.`);
        }
        await uploadService.deleteFileLocal(image.url);
        return prismaClient.productImage.delete({ where: { id: productImageId } });
    }
    // -----------------------------
}

export default new ProductService();
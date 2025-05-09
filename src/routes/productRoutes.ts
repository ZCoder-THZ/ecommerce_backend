// src/routes/productRoutes.ts
import { Router } from "express";
import {
    getAllProductsHandler,
    getProductByIdHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler,
    addProductImageHandler,
    deleteProductImageHandler
} from "../controllers/productController";

const productRouter = Router();

productRouter.get('/', getAllProductsHandler);
productRouter.get('/:id', getProductByIdHandler);
productRouter.post('/', createProductHandler);
productRouter.patch('/:id', updateProductHandler);
productRouter.delete('/:id', deleteProductHandler);
productRouter.post('/:id/images', addProductImageHandler);
productRouter.delete('/:id/images/:imageId', deleteProductImageHandler);

export default productRouter;
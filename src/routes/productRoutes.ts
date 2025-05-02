import { Express, Router } from "express";
import ProductController from "../controllers/productController";


const productRouter = Router();

productRouter.get('/', ProductController.getAllProducts);
productRouter.get('/:id', ProductController.getProductById);
productRouter.post('/', ProductController.createProduct);



export default productRouter
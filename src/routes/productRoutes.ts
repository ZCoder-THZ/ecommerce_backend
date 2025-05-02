import { Express, Router } from "express";
import ProductController from "../controllers/productController";


const productRouter = Router();

productRouter.get('/', ProductController.getAllProducts);

export default productRouter
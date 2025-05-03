import { Express, Router } from "express";
import ProductController from "../controllers/productController";
import { validateRequest } from "../middlewares/validateRequest";
import { ProductSchema, ProductUpdateSchema } from "../schemas/product.schema";
const productRouter = Router();

productRouter.get('/', ProductController.getAllProducts);
productRouter.get('/:id', ProductController.getProductById).delete('/:id', ProductController.deleteProduct).patch('/:id', validateRequest(ProductUpdateSchema), ProductController.updateProduct);
productRouter.post('/', validateRequest(ProductSchema), ProductController.createProduct);



export default productRouter
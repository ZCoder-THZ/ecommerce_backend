import { Router } from "express";
import categoryController from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.get('/', categoryController.getAllCategories).post(
    '/',
    categoryController.createCategory
);
categoryRouter.get('/:id', categoryController.getCategoryById).patch(
    '/:id', categoryController.updateCategory
).delete('/:id', categoryController.deleteCategory);

export default categoryRouter
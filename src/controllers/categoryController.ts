import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { CategoryCreateSchema, CategoryUpdateSchema, CategoryCreatePayload, CategoryUpdatePayload } from '../schemas/category.schema';

const service = new CategoryService();

class CategoryController {
    async getAllCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await service.getAllCategories();
            res.status(200).json(categories);
        } catch {
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        try {
            const category = await service.getCategoryById(id);
            res.status(200).json(category);
        } catch {
            res.status(404).json({ error: 'Category not found' });
        }
    }

    async createCategory(req: Request, res: Response): Promise<void> {
        const parse = CategoryCreateSchema.safeParse(req.body);
        if (!parse.success) res.status(400).json({ error: parse.error.message });

        try {
            const created = await service.createCategory(parse.data as CategoryCreatePayload);
            res.status(201).json(created);
        } catch {
            res.status(500).json({ error: 'Failed to create category' });
        }
    }

    async updateCategory(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        const parse = CategoryUpdateSchema.safeParse(req.body);
        if (!parse.success) res.status(400).json({ error: parse.error.message });

        try {
            const updated = await service.updateCategory(id, parse.data as CategoryUpdatePayload);
            res.status(200).json(updated);
        } catch {
            res.status(500).json({ error: 'Failed to update category' });
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        try {
            await service.deleteCategory(id);
            res.status(204).send();
        } catch {
            res.status(500).json({ error: 'Failed to delete category' });
        }
    }
}

export default new CategoryController();


// services/CategoryService.ts
import { CategoryRegistry } from '../repositories/categoryRepository';

const registry = new CategoryRegistry();

export class CategoryService {
    async getAllCategories() {
        // Add rules/filters later if needed
        return registry.findAll();
    }

    async getCategoryById(id: number) {
        const category = await registry.findById(id);
        if (!category) throw new Error('Not found');
        return category;
    }

    async createCategory(data: { name: string; iconUrl?: string }) {
        // Any business validation here (e.g. name uniqueness, logging, etc.)
        return registry.create(data);
    }

    async updateCategory(id: number, data: { name?: string; iconUrl?: string }) {
        return registry.update(id, data);
    }

    async deleteCategory(id: number) {
        return registry.delete(id);
    }
}

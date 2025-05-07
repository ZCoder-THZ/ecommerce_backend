// registry/CategoryRegistry.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CategoryRegistry {
    findAll() {
        return prisma.category.findMany();
    }

    findById(id: number) {
        return prisma.category.findUnique({ where: { id } });
    }

    create(data: { name: string; iconUrl?: string }) {
        return prisma.category.create({ data });
    }

    update(id: number, data: { name?: string; iconUrl?: string }) {
        return prisma.category.update({ where: { id }, data });
    }

    delete(id: number) {
        return prisma.category.delete({ where: { id } });
    }
}

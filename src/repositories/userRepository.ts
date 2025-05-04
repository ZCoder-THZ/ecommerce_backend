import { prismaClient } from "../lib/prismaClient";
import { registerType } from "../types/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
class UserRepository {

    async createSingleUser(registerData: registerType): Promise<any> {
        try {

            return await prismaClient.user.create({
                data: {
                    email: registerData.email,
                    name: registerData.name,
                    password: registerData.password
                },
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.error('🟥 Prisma Known Error:', error.message);
                console.error('Code:', error.code);
                console.error('Meta:', error.meta);
                return error
            }
        }
    }
    async findUserByEmail(email: string) {
        try {

            return await prismaClient.user.findUnique({
                where: {
                    email
                }
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                console.error('Code:', error.code);
                console.error('Meta:', error.meta);
                throw error
            }
        }
    }
}

export const userRepository = new UserRepository()
// src/services/orderService.ts
import { prismaClient } from '../lib/prismaClient';
import { OrderCreateInput, OrderItemCreateInput } from '../schemas/order.schema';
import { Prisma } from '@prisma/client';

class OrderService {
    async createOrder(orderData: OrderCreateInput) {
        const { userId, paymentMethodId, shippingAddress, billingAddress, items } = orderData;

        return prismaClient.$transaction(async (tx) => {
            // 1. Verify stock availability and calculate total amount
            let totalAmount = 0;
            const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

            for (const item of items) {
                const stockItem = await tx.stock.findUnique({
                    where: { id: item.stockId },
                });

                if (!stockItem) {
                    throw new Error(`Stock item with ID ${item.stockId} not found.`);
                }
                if (stockItem.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ID ${stockItem.productId}, SKU ${stockItem.sku}. Requested: ${item.quantity}, Available: ${stockItem.stock}`);
                }

                const itemTotalPrice = stockItem.price * item.quantity;
                totalAmount += itemTotalPrice;

                orderItemsData.push({
                    stockId: item.stockId,
                    quantity: item.quantity,
                    unitPrice: stockItem.price,
                    totalPrice: itemTotalPrice,
                });
            }

            // 2. Create the Order
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    orderDate: new Date(),
                    totalAmount,
                    paymentMethodId,
                    paymentStatus: 'PENDING', // Initial payment status
                    orderStatus: 'PROCESSING', // Initial order status
                    shippingAddress,
                    billingAddress,
                    // deliverySteps can be initialized or set later
                },
            });

            // 3. Create OrderItems and link them to the new Order
            const createdOrderItems = await tx.orderItem.createMany({
                data: orderItemsData.map(item => ({ ...item, orderId: newOrder.id })),
            });

            // 4. Decrement stock
            for (const item of items) {
                await tx.stock.update({
                    where: { id: item.stockId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            return {
                ...newOrder,
                orderItems: createdOrderItems, // Note: createMany doesn't return the created records directly in all DBs
                // You might need to fetch them separately if you need the full OrderItem objects
            };
        });
    }

    async getOrderById(orderId: number) {
        return prismaClient.order.findUnique({
            where: { id: orderId },
            include: {
                user: { select: { id: true, name: true, email: true } },
                paymentMethod: true,
                orderItems: {
                    include: {
                        stock: {
                            include: {
                                product: {
                                    select: { id: true, name: true, imageUrl: true }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    async getAllOrders(options: { skip?: number; take?: number } = {}) {
        const { skip, take } = options;
        return prismaClient.order.findMany({
            skip: skip,
            take: take,
            orderBy: {
                orderDate: 'desc' // Default sort: newest first
            },
            include: {
                // Include minimal related data for list view efficiency
                user: { select: { id: true, name: true, email: true } },
                paymentMethod: { select: { name: true } },
                // Optionally include item count or summary instead of full items
                _count: {
                    select: { orderItems: true },
                },
            }
        });
    }
}

export default new OrderService();
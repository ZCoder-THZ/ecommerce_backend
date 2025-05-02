import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Unsplash image URLs for different categories
const unsplashImages = {
    clothing: [
        'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9',
        'https://images.unsplash.com/photo-1551232864-3f0890e580d9',
        'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d'
    ],
    accessories: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e'
    ],
    footwear: [
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        'https://images.unsplash.com/photo-1600269452121-4f2416e55c28'
    ],
    banners: [
        'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
    ]
};

async function main() {
    // Clear existing data
    const deleteOrderItems = prisma.orderItem.deleteMany();
    const deleteOrders = prisma.order.deleteMany();
    const deleteStocks = prisma.stock.deleteMany();
    const deleteProductImages = prisma.productImage.deleteMany();
    const deleteProducts = prisma.product.deleteMany();
    const deleteProductStatuses = prisma.productStatus.deleteMany();
    const deleteCategories = prisma.category.deleteMany();
    const deletePaymentMethods = prisma.paymentMethod.deleteMany();
    const deleteBanners = prisma.homePageBannner.deleteMany();
    const deleteVerificationTokens = prisma.verificationToken.deleteMany();
    const deleteSessions = prisma.session.deleteMany();
    const deleteAccounts = prisma.account.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([
        deleteOrderItems,
        deleteOrders,
        deleteStocks,
        deleteProductImages,
        deleteProducts,
        deleteProductStatuses,
        deleteCategories,
        deletePaymentMethods,
        deleteBanners,
        deleteVerificationTokens,
        deleteSessions,
        deleteAccounts,
        deleteUsers
    ]);

    // Create users
    const users = await Promise.all([
        prisma.user.create({
            data: {
                name: 'Admin User',
                email: 'admin@example.com',
                emailVerified: new Date(),
                role: 'ADMIN',
                image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
            }
        }),
        prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john@example.com',
                emailVerified: new Date(),
                role: 'USER',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
            }
        }),
        prisma.user.create({
            data: {
                name: 'Jane Smith',
                email: 'jane@example.com',
                emailVerified: new Date(),
                role: 'USER',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
            }
        })
    ]);

    // Create payment methods
    const paymentMethods = await Promise.all([
        prisma.paymentMethod.create({ data: { name: 'Credit Card' } }),
        prisma.paymentMethod.create({ data: { name: 'PayPal' } }),
        prisma.paymentMethod.create({ data: { name: 'Bank Transfer' } }),
        prisma.paymentMethod.create({ data: { name: 'Cash on Delivery' } })
    ]);

    // Create product statuses
    const productStatuses = await Promise.all([
        prisma.productStatus.create({ data: { name: 'In Stock' } }),
        prisma.productStatus.create({ data: { name: 'Low Stock' } }),
        prisma.productStatus.create({ data: { name: 'Out of Stock' } }),
        prisma.productStatus.create({ data: { name: 'Discontinued' } })
    ]);

    // Create categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Men\'s Clothing',
                iconUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Women\'s Clothing',
                iconUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Accessories',
                iconUrl: 'https://images.unsplash.com/photo-1591348122449-02525d70379b'
            }
        }),
        prisma.category.create({
            data: {
                name: 'Footwear',
                iconUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772'
            }
        })
    ]);

    // Create products
    const products = await Promise.all([
        // Men's Clothing
        prisma.product.create({
            data: {
                name: 'Classic White T-Shirt',
                description: 'Premium quality cotton t-shirt for men',
                imageUrl: unsplashImages.clothing[0],
                categoryId: categories[0].id,
                statusId: productStatuses[0].id
            }
        }),
        prisma.product.create({
            data: {
                name: 'Slim Fit Jeans',
                description: 'Comfortable slim fit jeans with stretch',
                imageUrl: unsplashImages.clothing[1],
                categoryId: categories[0].id,
                statusId: productStatuses[0].id
            }
        }),
        // Women's Clothing
        prisma.product.create({
            data: {
                name: 'Summer Dress',
                description: 'Lightweight floral summer dress',
                imageUrl: unsplashImages.clothing[2],
                categoryId: categories[1].id,
                statusId: productStatuses[0].id
            }
        }),
        // Accessories
        prisma.product.create({
            data: {
                name: 'Leather Wallet',
                description: 'Genuine leather wallet with multiple compartments',
                imageUrl: unsplashImages.accessories[0],
                categoryId: categories[2].id,
                statusId: productStatuses[0].id
            }
        }),
        prisma.product.create({
            data: {
                name: 'Aviator Sunglasses',
                description: 'Classic aviator style sunglasses with UV protection',
                imageUrl: unsplashImages.accessories[1],
                categoryId: categories[2].id,
                statusId: productStatuses[0].id
            }
        }),
        // Footwear
        prisma.product.create({
            data: {
                name: 'Running Shoes',
                description: 'Lightweight running shoes with cushioning',
                imageUrl: unsplashImages.footwear[0],
                categoryId: categories[3].id,
                statusId: productStatuses[0].id
            }
        }),
        prisma.product.create({
            data: {
                name: 'Casual Sneakers',
                description: 'Trendy sneakers for everyday wear',
                imageUrl: unsplashImages.footwear[1],
                categoryId: categories[3].id,
                statusId: productStatuses[0].id
            }
        })
    ]);

    // Add product images
    await Promise.all([
        // White T-Shirt
        prisma.productImage.createMany({
            data: [
                { productId: products[0].id, url: unsplashImages.clothing[0] + '?w=500&h=500' },
                { productId: products[0].id, url: unsplashImages.clothing[0] + '?w=500&h=500&crop=entropy' }
            ]
        }),
        // Jeans
        prisma.productImage.createMany({
            data: [
                { productId: products[1].id, url: unsplashImages.clothing[1] + '?w=500&h=500' },
                { productId: products[1].id, url: unsplashImages.clothing[1] + '?w=500&h=500&crop=entropy' }
            ]
        }),
        // Summer Dress
        prisma.productImage.createMany({
            data: [
                { productId: products[2].id, url: unsplashImages.clothing[2] + '?w=500&h=500' },
                { productId: products[2].id, url: unsplashImages.clothing[2] + '?w=500&h=500&crop=entropy' }
            ]
        })
    ]);

    // Add stock items
    const stocks = await Promise.all([
        // White T-Shirt
        prisma.stock.create({
            data: {
                productId: products[0].id,
                sku: 'MTS-S',
                stock: 50,
                price: 24.99,
                size: 'S'
            }
        }),
        prisma.stock.create({
            data: {
                productId: products[0].id,
                sku: 'MTS-M',
                stock: 75,
                price: 24.99,
                size: 'M'
            }
        }),
        prisma.stock.create({
            data: {
                productId: products[0].id,
                sku: 'MTS-L',
                stock: 60,
                price: 24.99,
                size: 'L'
            }
        }),
        // Slim Fit Jeans
        prisma.stock.create({
            data: {
                productId: products[1].id,
                sku: 'MJ-30',
                stock: 30,
                price: 59.99,
                size: '30'
            }
        }),
        prisma.stock.create({
            data: {
                productId: products[1].id,
                sku: 'MJ-32',
                stock: 25,
                price: 59.99,
                size: '32'
            }
        }),
        // Summer Dress
        prisma.stock.create({
            data: {
                productId: products[2].id,
                sku: 'WD-S',
                stock: 15,
                price: 39.99,
                size: 'S'
            }
        }),
        // Leather Wallet
        prisma.stock.create({
            data: {
                productId: products[3].id,
                sku: 'ACC-WAL',
                stock: 100,
                price: 29.99
            }
        }),
        // Aviator Sunglasses
        prisma.stock.create({
            data: {
                productId: products[4].id,
                sku: 'ACC-SUN',
                stock: 40,
                price: 49.99
            }
        }),
        // Running Shoes
        prisma.stock.create({
            data: {
                productId: products[5].id,
                sku: 'SH-RUN-8',
                stock: 20,
                price: 89.99,
                size: '8'
            }
        }),
        prisma.stock.create({
            data: {
                productId: products[5].id,
                sku: 'SH-RUN-9',
                stock: 15,
                price: 89.99,
                size: '9'
            }
        }),
        // Casual Sneakers
        prisma.stock.create({
            data: {
                productId: products[6].id,
                sku: 'SH-SNK-9',
                stock: 25,
                price: 69.99,
                size: '9'
            }
        })
    ]);

    // Create orders
    const orders = await Promise.all([
        // Order 1 - John Doe
        prisma.order.create({
            data: {
                userId: users[1].id,
                orderDate: new Date('2023-05-15'),
                totalAmount: 84.98,
                paymentStatus: 'Paid',
                paymentMethodId: paymentMethods[0].id,
                orderStatus: 'Delivered',
                shippingAddress: '123 Main St, Anytown, USA',
                billingAddress: '123 Main St, Anytown, USA',
                sailDate: new Date('2023-05-16'),
                deliverySteps: {
                    ordered: '2023-05-15T10:00:00Z',
                    processed: '2023-05-15T14:30:00Z',
                    shipped: '2023-05-16T09:15:00Z',
                    delivered: '2023-05-18T13:45:00Z'
                }
            }
        }),
        // Order 2 - Jane Smith
        prisma.order.create({
            data: {
                userId: users[2].id,
                orderDate: new Date('2023-05-20'),
                totalAmount: 149.98,
                paymentStatus: 'Paid',
                paymentMethodId: paymentMethods[1].id,
                orderStatus: 'Shipped',
                shippingAddress: '456 Oak Ave, Somewhere, USA',
                billingAddress: '456 Oak Ave, Somewhere, USA',
                sailDate: new Date('2023-05-21'),
                deliverySteps: {
                    ordered: '2023-05-20T11:30:00Z',
                    processed: '2023-05-20T16:45:00Z',
                    shipped: '2023-05-21T10:20:00Z'
                }
            }
        }),
        // Order 3 - John Doe
        prisma.order.create({
            data: {
                userId: users[1].id,
                orderDate: new Date('2023-06-01'),
                totalAmount: 59.99,
                paymentStatus: 'Processing',
                paymentMethodId: paymentMethods[2].id,
                orderStatus: 'Processing',
                shippingAddress: '123 Main St, Anytown, USA',
                billingAddress: '123 Main St, Anytown, USA'
            }
        })
    ]);

    // Add order items
    await Promise.all([
        // Order 1 items
        prisma.orderItem.create({
            data: {
                orderId: orders[0].id,
                stockId: stocks[0].id, // T-Shirt S
                quantity: 1,
                unitPrice: stocks[0].price,
                totalPrice: stocks[0].price * 1
            }
        }),
        prisma.orderItem.create({
            data: {
                orderId: orders[0].id,
                stockId: stocks[3].id, // Jeans 30
                quantity: 1,
                unitPrice: stocks[3].price,
                totalPrice: stocks[3].price * 1
            }
        }),
        // Order 2 items
        prisma.orderItem.create({
            data: {
                orderId: orders[1].id,
                stockId: stocks[6].id, // Summer Dress S
                quantity: 1,
                unitPrice: stocks[6].price,
                totalPrice: stocks[6].price * 1
            }
        }),
        prisma.orderItem.create({
            data: {
                orderId: orders[1].id,
                stockId: stocks[8].id, // Running Shoes 8
                quantity: 1,
                unitPrice: stocks[8].price,
                totalPrice: stocks[8].price * 1
            }
        }),
        // Order 3 items
        prisma.orderItem.create({
            data: {
                orderId: orders[2].id,
                stockId: stocks[7].id, // Aviator Sunglasses
                quantity: 1,
                unitPrice: stocks[7].price,
                totalPrice: stocks[7].price * 1
            }
        })
    ]);

    // Create home page banners
    await Promise.all([
        prisma.homePageBannner.create({
            data: {
                title: 'Summer Collection',
                imageUrl: unsplashImages.banners[0] + '?w=1200&h=400',
                status: 'ACTIVE'
            }
        }),
        prisma.homePageBannner.create({
            data: {
                title: 'New Arrivals',
                imageUrl: unsplashImages.banners[1] + '?w=1200&h=400',
                status: 'ACTIVE'
            }
        }),
        prisma.homePageBannner.create({
            data: {
                title: 'Limited Time Offer',
                imageUrl: unsplashImages.banners[2] + '?w=1200&h=400',
                status: 'ACTIVE'
            }
        })
    ]);

    console.log('Database seeded successfully with realistic e-commerce data!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
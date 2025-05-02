// services/NotificationService.ts
import { PrismaClient } from '@prisma/client';
import { Server, Socket } from 'socket.io';
type notificationType = {
    title: string;
    message: string;
    type: string;
    userId: string;
    senderId: string;
    issueId: number | null;
    createdAt: Date;
    read: boolean;

};

export default class NotificationService {
    private prisma: PrismaClient;

    constructor(private io: Server) {
        this.prisma = new PrismaClient();
    }

    async createNotification({
        title,
        message,
        type,
        userId,
        senderId,
        issueId,
        createdAt = new Date(),
        read = false
    }: notificationType) {
        const shouldNotifyAdmins = [
            'issue_creation',
            'issue_approved',
            'issue_rejected',
            'issue_status_change'
        ].includes(type);


        const shouldNotifyAssignee = [
            'issue_assignment',
            'issue_mention',
            'comment',
            'role_change'
        ].includes(type);

        // Case 1: Notify specific user (e.g., assignee)
        if (shouldNotifyAssignee && userId) {
            const notification = await this.prisma.notification.create({
                data: {
                    title,
                    message,
                    type,
                    userId,
                    senderId,
                    issueId,
                    createdAt,
                    read
                },
                include: {
                    issue: { select: { id: true, title: true, status: true } },
                    receiver: { select: { id: true, name: true } },
                    sender: { select: { id: true, name: true } }
                }
            });

            this.io.to(`user-${userId}`).emit('new-notification', notification);
            return notification;
        }

        // Case 2: Notify all admins and devs
        if (shouldNotifyAdmins) {
            const adminsAndDevs = await this.prisma.user.findMany({
                where: { role: { in: [1, 2] } },
                select: { id: true }
            });

            const notifications = await Promise.all(
                adminsAndDevs.map(({ id }) =>
                    this.prisma.notification.create({
                        data: {
                            title,
                            message,
                            type,
                            userId: id,
                            senderId,
                            issueId,
                            createdAt: new Date(),
                            read
                        },
                        include: {
                            issue: { select: { id: true, title: true, status: true } },
                            receiver: { select: { id: true, name: true } },
                            sender: { select: { id: true, name: true } }
                        }
                    })
                )
            );

            // Emit to each individual user socket
            notifications.forEach((notification) => {
                try {
                    this.io.to(`user-${notification.userId}`).emit('new-notification', notification);
                } catch (err) {
                    console.error(`Error sending notification to user-${notification.userId}:`, err);
                }
            });

            return notifications;
        }


        // No valid target
        throw new Error("No valid userId provided and type does not require broadcasting.");
    }


    async getUserNotifications(userId: string) {
        console.log(
            'getting notificaitons'
        )
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                issue: {
                    select: {
                        id: true,
                        title: true,
                        status: true
                    }
                }
            }
        });
    }

    async markAsRead(userId: string, notificationId: number) {
        return this.prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,

            },
            data: { read: true }
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: {
                userId,
                read: false
            },
            data: { read: true }
        });
    }

    // async getUnreadCount(userId: string) {
    //     return this.prisma.notification.count({
    //         where: {
    //             userId,
    //             read: false
    //         }
    //     });
    // }
}
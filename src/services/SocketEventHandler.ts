import { Socket } from "socket.io";
import NotificationService from "./NotificationService";

export class SocketEventHandler {
    constructor(private notificationService: NotificationService) { }

    async handleConnection(socket: Socket) {
        const user = socket.data.user;

        // Join appropriate rooms
        socket.join(`user-${user.id}`);
        if (user.role === 1) socket.join("admin-room");
        if (user.role === 2) socket.join("developer-room");

        console.log(`User connected: ${user.name}`);
    }

    async handleDisconnect(socket: Socket) {
        console.log(`User disconnected: ${socket.data.user.name}`);
    }

    async handleGetNotifications(socket: Socket, callback: Function) {
        try {
            const notifications = await this.notificationService.getUserNotifications(socket.data.user.id);
            callback({ success: true, notifications });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            callback({ success: false, error: "Failed to fetch notifications" });
        }
    }

    async handleAdminNotification(socket: Socket, data: any) {
        try {
            const notification = await this.notificationService.createNotification(data);
            if (!notification) {
                return socket.emit("send-admin-notification", { success: false, error: "Failed to send notification" });
            }
            socket.emit("send-admin-notification", { success: true });
        } catch (error) {
            console.error('Error sending admin notification:', error);
            socket.emit("send-admin-notification", { success: false, error: "Failed to send notification" });
        }
    }

    async handleMarkAsRead(socket: Socket, notificationId: number, callback: Function) {
        try {
            const notification = await this.notificationService.markAsRead(
                socket.data.user.id,
                notificationId
            );
            if (!notification) {
                return callback({ success: false, error: "Notification not found" });
            }
            callback({ success: true });
        } catch (error) {
            console.error('Error marking as read:', error);
            callback({ success: false, error: "Failed to mark as read" });
        }
    }
    async handleMarkAllAsRead(socket: Socket, callback: Function) {
        try {
            await this.notificationService.markAllAsRead(socket.data.user.id);
            callback({ success: true });
        } catch (error) {
            console.error('Error marking all as read:', error);
            callback({ success: false, error: "Failed to mark all as read" });
        }
    }
    // Add methods for all your notification types
    async handleIssueCreationNotification(data: any) {
        // Implementation for issue creation notification
    }

    async handleIssueApprovalNotification(data: any) {
        // Implementation for approved issue notification
    }

    // ... other notification handlers
}
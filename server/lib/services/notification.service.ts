import { PrismaClient } from '@prisma/client';
import { emailService } from './email.service';
import { webSocketService } from './websocket-notification.service';

export interface NotificationData {
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  category: 'system' | 'security' | 'deployment' | 'ai' | 'billing' | 'team';
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  inApp: boolean;
  email: boolean;
  push: boolean;
  categories: {
    system: boolean;
    security: boolean;
    deployment: boolean;
    ai: boolean;
    billing: boolean;
    team: boolean;
  };
  priorities: {
    low: boolean;
    medium: boolean;
    high: boolean;
    critical: boolean;
  };
}

export class NotificationService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Send a notification through all enabled channels
   */
  async sendNotification(notification: NotificationData): Promise<void> {
    try {
      // Get user preferences
      const preferences = await this.getUserPreferences(notification.userId);
      
      // Check if notification should be sent based on preferences
      if (!this.shouldSendNotification(notification, preferences)) {
        return;
      }

      // Store notification in database
      const storedNotification = await this.storeNotification(notification);

      // Send through enabled channels
      const promises: Promise<void>[] = [];

      // In-app notification (real-time via WebSocket)
      if (preferences.inApp) {
        promises.push(this.sendInAppNotification(notification));
      }

      // Email notification
      if (preferences.email) {
        promises.push(this.sendEmailNotification(notification));
      }

      // Push notification (handled by client-side service worker)
      if (preferences.push) {
        promises.push(this.sendPushNotification(notification));
      }

      // Wait for all notifications to be sent
      await Promise.allSettled(promises);

      console.log(`✅ Notification sent to user ${notification.userId}: ${notification.title}`);
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * Send bulk notifications to multiple users
   */
  async sendBulkNotification(
    userIds: string[],
    notification: Omit<NotificationData, 'userId'>
  ): Promise<void> {
    const promises = userIds.map(userId =>
      this.sendNotification({ ...notification, userId })
    );

    await Promise.allSettled(promises);
  }

  /**
   * Send notification to all users with specific role
   */
  async sendNotificationToRole(
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN',
    notification: Omit<NotificationData, 'userId'>
  ): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: { role },
      select: { id: true }
    });

    const userIds = users.map(user => user.id);
    await this.sendBulkNotification(userIds, notification);
  }

  /**
   * Send notification to team members
   */
  async sendNotificationToTeam(
    teamId: string,
    notification: Omit<NotificationData, 'userId'>
  ): Promise<void> {
    const teamMembers = await this.prisma.teamMember.findMany({
      where: { 
        teamId,
        status: 'ACTIVE'
      },
      select: { userId: true }
    });

    const userIds = teamMembers.map(member => member.userId);
    await this.sendBulkNotification(userIds, notification);
  }

  /**
   * Get user notification preferences
   */
  private async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    // In a real implementation, you'd fetch from database
    // For now, return default preferences
    return {
      inApp: true,
      email: true,
      push: true,
      categories: {
        system: true,
        security: true,
        deployment: true,
        ai: true,
        billing: true,
        team: true,
      },
      priorities: {
        low: true,
        medium: true,
        high: true,
        critical: true,
      },
    };
  }

  /**
   * Check if notification should be sent based on user preferences
   */
  private shouldSendNotification(
    notification: NotificationData,
    preferences: NotificationPreferences
  ): boolean {
    return (
      preferences.categories[notification.category] &&
      preferences.priorities[notification.priority]
    );
  }

  /**
   * Store notification in database for persistence
   */
  private async storeNotification(notification: NotificationData) {
    // In a real implementation, you'd store in a notifications table
    // For now, we'll just log it
    console.log('📝 Storing notification:', {
      userId: notification.userId,
      title: notification.title,
      category: notification.category,
      priority: notification.priority,
    });

    return {
      id: crypto.randomUUID(),
      ...notification,
      timestamp: new Date(),
      read: false,
    };
  }

  /**
   * Send in-app notification via WebSocket
   */
  private async sendInAppNotification(notification: NotificationData): Promise<void> {
    try {
      await webSocketService.sendNotificationToUser(notification.userId, {
        type: 'notification',
        data: {
          id: crypto.randomUUID(),
          ...notification,
          timestamp: new Date(),
          read: false,
        },
      });
    } catch (error) {
      console.error('Failed to send in-app notification:', error);
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(notification: NotificationData): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: notification.userId },
        select: { email: true, firstName: true, lastName: true }
      });

      if (!user) {
        throw new Error(`User not found: ${notification.userId}`);
      }

      await emailService.sendNotificationEmail({
        to: user.email,
        notification: {
          id: crypto.randomUUID(),
          ...notification,
          timestamp: new Date(),
          read: false,
        },
        userPreferences: {
          unsubscribeUrl: `${process.env.FRONTEND_URL}/settings/notifications`,
          dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
        },
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  /**
   * Send push notification (via WebSocket to trigger client-side push)
   */
  private async sendPushNotification(notification: NotificationData): Promise<void> {
    try {
      await webSocketService.sendNotificationToUser(notification.userId, {
        type: 'push_notification',
        data: {
          title: notification.title,
          message: notification.message,
          icon: '/favicon.ico',
          tag: crypto.randomUUID(),
          actionUrl: notification.actionUrl,
        },
      });
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }
  }

  /**
   * Create system notification
   */
  static createSystemNotification(
    userId: string,
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): NotificationData {
    return {
      userId,
      type: 'info',
      title,
      message,
      category: 'system',
      priority,
    };
  }

  /**
   * Create security notification
   */
  static createSecurityNotification(
    userId: string,
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'high',
    actionUrl?: string
  ): NotificationData {
    return {
      userId,
      type: 'warning',
      title,
      message,
      category: 'security',
      priority,
      actionUrl,
      actionLabel: 'View Details',
    };
  }

  /**
   * Create deployment notification
   */
  static createDeploymentNotification(
    userId: string,
    title: string,
    message: string,
    success: boolean,
    actionUrl?: string
  ): NotificationData {
    return {
      userId,
      type: success ? 'success' : 'error',
      title,
      message,
      category: 'deployment',
      priority: success ? 'low' : 'medium',
      actionUrl,
      actionLabel: 'View Deployment',
    };
  }

  /**
   * Create AI service notification
   */
  static createAINotification(
    userId: string,
    title: string,
    message: string,
    success: boolean,
    actionUrl?: string
  ): NotificationData {
    return {
      userId,
      type: success ? 'success' : 'error',
      title,
      message,
      category: 'ai',
      priority: 'low',
      actionUrl,
      actionLabel: 'View Results',
    };
  }

  /**
   * Create billing notification
   */
  static createBillingNotification(
    userId: string,
    title: string,
    message: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    actionUrl?: string
  ): NotificationData {
    return {
      userId,
      type: 'info',
      title,
      message,
      category: 'billing',
      priority,
      actionUrl,
      actionLabel: 'Manage Billing',
    };
  }

  /**
   * Create team notification
   */
  static createTeamNotification(
    userId: string,
    title: string,
    message: string,
    actionUrl?: string
  ): NotificationData {
    return {
      userId,
      type: 'info',
      title,
      message,
      category: 'team',
      priority: 'medium',
      actionUrl,
      actionLabel: 'View Team',
    };
  }
}

export const notificationService = new NotificationService(new PrismaClient());
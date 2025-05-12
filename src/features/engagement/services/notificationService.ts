import { Notification, NotificationPreferences } from '../types';

export class NotificationService {
  private static instance: NotificationService;
  
  private constructor() {}

  static getInstance(): NotificationService {
    if (!this.instance) {
      this.instance = new NotificationService();
    }
    return this.instance;
  }

  async sendNotification(notification: Notification): Promise<void> {
    if (!('Notification' in window)) return;
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new window.Notification(notification.title, {
        body: notification.message,
        icon: notification.icon
      });
    }
  }

  getUserPreferences(): NotificationPreferences {
    return JSON.parse(localStorage.getItem('notificationPreferences') || '{}');
  }
}
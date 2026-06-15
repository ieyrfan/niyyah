import { db } from '../lib/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

export interface NotificationSettings {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  sunnah_reminders: boolean;
  offset: number;
}

class NotificationService {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') return true;
    
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (e) {
      return false;
    }
  }

  async registerFCMToken(userId: string, token: string) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token),
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error registering FCM token:', error);
    }
  }

  async sendLocalNotification(title: string, body: string) {
    const hasPermission = Notification.permission === 'granted';
    if (!hasPermission) return;

    try {
      // Use service worker notification if available, fallback to new Notification
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(title, {
          body,
          icon: '/logo.png',
          badge: '/logo.png',
        });
      } else {
        new Notification(title, { body });
      }
    } catch (e) {
      new Notification(title, { body });
    }
  }

  // This logic would normally be handled by a Service Worker for it to work 
  // background, but for this applet we simulate the logic:
  schedulePrayerReminders(prayerTimes: any, settings: NotificationSettings) {
    if (Notification.permission !== 'granted') return;

    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const now = new Date();

    prayers.forEach(p => {
      if (!(settings as any)[p]) return;

      const [hours, minutes] = prayerTimes[p].split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);

      // Apply offset
      const reminderTime = new Date(prayerTime.getTime() - settings.offset * 60000);

      if (reminderTime > now) {
        const diff = reminderTime.getTime() - now.getTime();
        
        // Use a timeout to simulate the reminder
        setTimeout(() => {
          this.sendLocalNotification(
            `Waktu ${p.charAt(0).toUpperCase() + p.slice(1)}`,
            `Hampir waktu solat dalam ${settings.offset} minit. Bersiaplah untuk ibadah.`
          );
        }, diff);
      }
    });
  }

  scheduleSunnahReminders(settings: NotificationSettings) {
    if (!settings.sunnah_reminders || Notification.permission !== 'granted') return;

    // Simulate scheduling a daily reminder at 9 AM for sunnah deeds
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(9, 0, 0, 0);

    if (reminderTime < now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const diff = reminderTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.sendLocalNotification(
        "Peringatan Sunnah Harian",
        "Jangan lupa untuk amalkan sunnah harian hari ini. Semoga dipermudahkan segala urusan."
      );
      // Recursively schedule for tomorrow
      this.scheduleSunnahReminders(settings);
    }, diff);
  }
}

export const notificationService = new NotificationService();

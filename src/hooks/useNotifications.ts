import { useState, useEffect } from 'react';

const NOTIFICATION_PERMISSION_KEY = 'momentum_notification_permission';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      localStorage.setItem(NOTIFICATION_PERMISSION_KEY, result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    try {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  const scheduleHabitReminder = (habitName: string, time: Date) => {
    const now = new Date();
    const delay = time.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        showNotification('Habit Reminder', {
          body: `Time to complete: ${habitName}`,
          tag: `habit-reminder-${habitName}`,
          requireInteraction: false,
        });
      }, delay);
    }
  };

  const sendCompletionCelebration = (habitName: string, streak: number) => {
    showNotification('🎉 Habit Completed!', {
      body: `Great job completing "${habitName}"! ${streak > 1 ? `${streak} day streak! 🔥` : ''}`,
      tag: 'habit-completion',
    });
  };

  const sendStreakMilestone = (habitName: string, streak: number) => {
    let emoji = '🎯';
    let message = `${streak} day streak!`;

    if (streak === 7) {
      emoji = '🔥';
      message = 'One week streak!';
    } else if (streak === 30) {
      emoji = '💪';
      message = 'One month streak!';
    } else if (streak === 100) {
      emoji = '💯';
      message = '100 day streak!';
    }

    showNotification(`${emoji} Streak Milestone`, {
      body: `${habitName}: ${message}`,
      tag: 'streak-milestone',
      requireInteraction: true,
    });
  };

  return {
    supported,
    permission,
    requestPermission,
    showNotification,
    scheduleHabitReminder,
    sendCompletionCelebration,
    sendStreakMilestone,
  };
}

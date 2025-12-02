import { useState } from 'react';
import { Bell, BellOff, CheckCircle } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import './NotificationSettings.css';

export function NotificationSettings() {
  const { supported, permission, requestPermission, showNotification } = useNotifications();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowSuccess(true);
      showNotification('Notifications Enabled', {
        body: 'You will now receive habit reminders and celebrations!',
      });
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleTestNotification = () => {
    showNotification('Test Notification', {
      body: 'This is how your habit reminders will look!',
    });
  };

  if (!supported) {
    return (
      <div className="notification-settings">
        <div className="notification-header">
          <BellOff size={32} />
          <h2>Notifications Not Supported</h2>
          <p>Your browser doesn't support push notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-settings">
      <div className="notification-header">
        <Bell size={32} color="var(--primary)" />
        <h2>Push Notifications</h2>
        <p>Stay on track with habit reminders and celebrate your wins!</p>
      </div>

      <div className="notification-status">
        {permission === 'granted' && (
          <div className="status-card success">
            <CheckCircle size={24} />
            <div>
              <h3>Notifications Enabled</h3>
              <p>You're all set to receive habit reminders</p>
            </div>
          </div>
        )}

        {permission === 'denied' && (
          <div className="status-card error">
            <BellOff size={24} />
            <div>
              <h3>Notifications Blocked</h3>
              <p>Please enable notifications in your browser settings</p>
            </div>
          </div>
        )}

        {permission === 'default' && (
          <div className="status-card">
            <Bell size={24} />
            <div>
              <h3>Enable Notifications</h3>
              <p>Get reminders when it's time to complete your habits</p>
            </div>
          </div>
        )}
      </div>

      <div className="notification-actions">
        {permission === 'default' && (
          <button className="btn btn-primary btn-lg" onClick={handleEnableNotifications}>
            <Bell size={20} />
            Enable Notifications
          </button>
        )}

        {permission === 'granted' && (
          <button className="btn btn-outline" onClick={handleTestNotification}>
            Send Test Notification
          </button>
        )}
      </div>

      {showSuccess && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>Notifications enabled successfully!</span>
        </div>
      )}

      <div className="notification-features">
        <h3>What you'll get:</h3>
        <ul>
          <li>✅ Habit completion celebrations</li>
          <li>🔥 Streak milestone alerts</li>
          <li>🎯 Daily habit reminders (coming soon)</li>
          <li>📊 Weekly progress summaries (coming soon)</li>
        </ul>
      </div>
    </div>
  );
}

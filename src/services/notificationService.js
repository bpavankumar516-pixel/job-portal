// Dynamic Notification Management Service
const NOTIFICATIONS_KEY = 'jobportal_notifications';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_init_1',
    type: 'application',
    title: 'New Application Received',
    message: 'Rahul Sharma applied for Frontend Developer at Google',
    time: '15m ago',
    timestamp: Date.now() - 15 * 60 * 1000,
    unread: true,
    link: '/jobs',
    iconType: 'user-check',
  },
  {
    id: 'notif_init_2',
    type: 'job',
    title: 'Job Posting Live',
    message: 'Backend Developer at Microsoft is now active and receiving applicants',
    time: '1h ago',
    timestamp: Date.now() - 60 * 60 * 1000,
    unread: true,
    link: '/jobs',
    iconType: 'briefcase',
  },
  {
    id: 'notif_init_3',
    type: 'candidate',
    title: 'Candidate Profile Registered',
    message: 'Priya Patel updated skills with React and Node.js',
    time: '3h ago',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    unread: false,
    link: '/candidates',
    iconType: 'user',
  },
];

/**
 * Format relative time from timestamp
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
};

/**
 * Get stored notifications from LocalStorage
 */
export const getStoredNotifications = () => {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!data) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : DEFAULT_NOTIFICATIONS;
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
};

/**
 * Save notifications to LocalStorage & dispatch sync event
 */
export const saveNotifications = (notifications) => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new Event('notifications_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save notifications:', err);
  }
};

/**
 * Add a new dynamic notification
 */
export const addNotification = ({
  title,
  message,
  type = 'info',
  link = '/dashboard',
  iconType = 'bell',
}) => {
  try {
    const current = getStoredNotifications();
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      title,
      message,
      time: 'Just now',
      timestamp: Date.now(),
      unread: true,
      link,
      iconType,
    };
    const updated = [newNotif, ...current].slice(0, 30);
    saveNotifications(updated);
    return newNotif;
  } catch (err) {
    console.error('Failed to add notification:', err);
    return null;
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = (id) => {
  try {
    const current = getStoredNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, unread: false } : n));
    saveNotifications(updated);
  } catch (err) {
    console.error('Failed to mark notification as read:', err);
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = () => {
  try {
    const current = getStoredNotifications();
    const updated = current.map((n) => ({ ...n, unread: false }));
    saveNotifications(updated);
  } catch (err) {
    console.error('Failed to mark all notifications as read:', err);
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = () => {
  try {
    saveNotifications([]);
  } catch (err) {
    console.error('Failed to clear notifications:', err);
  }
};

/**
 * Get total unread count
 */
export const getUnreadNotificationCount = () => {
  const list = getStoredNotifications();
  return list.filter((n) => n.unread).length;
};

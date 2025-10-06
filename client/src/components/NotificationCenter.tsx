"use client";

import { useState, useEffect } from "react";
import { Notification, HealthDataService, getNotificationIcon } from "../services/healthDataService";

interface NotificationCenterProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onNotificationCountChange?: (count: number) => void;
}

export default function NotificationCenter({
  userId,
  isOpen,
  onClose,
  onNotificationCountChange
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    onNotificationCountChange?.(unreadCount);
  }, [notifications, onNotificationCountChange]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await HealthDataService.getNotifications(userId);
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await HealthDataService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => HealthDataService.markNotificationAsRead(n.id))
      );
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.read;
      case 'high':
        return notif.priority === 'high' || notif.priority === 'urgent';
      default:
        return true;
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'low':
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-50 border-l-blue-400';
      case 'medication':
        return 'bg-purple-50 border-l-purple-400';
      case 'test-result':
        return 'bg-green-50 border-l-green-400';
      case 'system':
        return 'bg-gray-50 border-l-gray-400';
      case 'reminder':
        return 'bg-yellow-50 border-l-yellow-400';
      default:
        return 'bg-gray-50 border-l-gray-400';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="notification-title" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gray-600 bg-opacity-75 transition-opacity" onClick={onClose}></div>

      {/* Notification panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 id="notification-title" className="text-lg font-semibold text-gray-900">
                Notifications
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter tabs */}
            <div className="flex space-x-1 mt-4">
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
                { key: 'high', label: 'Priority', count: notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as 'all' | 'unread' | 'high')}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    filter === tab.key
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Actions */}
            {notifications.some(n => !n.read) && (
              <div className="mt-3">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <div className="text-red-500 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={loadNotifications}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'unread' ? 'All caught up!' : 'No notifications'}
                </h3>
                <p className="text-gray-600">
                  {filter === 'unread'
                    ? "You've read all your notifications."
                    : "We'll notify you when something important happens."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    getPriorityColor={getPriorityColor}
                    getTypeColor={getTypeColor}
                    formatTimeAgo={formatTimeAgo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (priority: string) => string;
  getTypeColor: (type: string) => string;
  formatTimeAgo: (date: string) => string;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  getPriorityColor,
  getTypeColor,
  formatTimeAgo
}: NotificationItemProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`p-4 border-l-4 ${getTypeColor(notification.type)} ${
        !notification.read ? 'bg-blue-50' : 'bg-white'
      } hover:bg-gray-50 transition-colors`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
            {getNotificationIcon(notification.type)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${
                !notification.read ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </h4>
              <p className={`text-sm mt-1 ${
                !notification.read ? 'text-gray-700' : 'text-gray-600'
              }`}>
                {notification.message}
              </p>
            </div>

            {/* Unread indicator */}
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {formatTimeAgo(notification.createdAt)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                {notification.priority}
              </span>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    title="Mark as read"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                  title="Delete notification"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Action URL */}
          {notification.actionUrl && (
            <button
              onClick={() => {
                if (!notification.read) {
                  onMarkAsRead(notification.id);
                }
                // In a real app, you would navigate to the URL
                console.log('Navigate to:', notification.actionUrl);
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Details →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple notification badge component for use in navbar
interface NotificationBadgeProps {
  count: number;
  onClick: () => void;
}

export function NotificationBadge({ count, onClick }: NotificationBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg relative focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200"
      aria-label={`Notifications${count > 0 ? ` (${count})` : ''}`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>

      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-xs font-medium text-white">
            {count > 99 ? '99+' : count}
          </span>
        </span>
      )}
    </button>
  );
}
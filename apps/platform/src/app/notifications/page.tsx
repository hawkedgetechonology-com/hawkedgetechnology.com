'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  FolderKanban,
  Receipt,
  Clock,
  MessageSquare,
  Eye
} from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    fetch('/api/studio/notifications')
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching notifications:', err);
        setLoading(false);
      });
  };

  const handleMarkRead = async (id: string) => {
    try {
      const res = await fetch(`/api/studio/notifications/${id}/read`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/studio/notifications/mark-all-read', {
        method: 'PATCH',
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-mono text-[10px] text-text-muted">
        <span>// HARNESSING COMMUNICATIONS NETWORKS...</span>
      </div>
    );
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'PROJECT_UPDATE':
        return <FolderKanban className="w-4 h-4 text-brand-primary" />;
      case 'INVOICE_UPDATE':
        return <Receipt className="w-4 h-4 text-semantic-danger" />;
      case 'SUPPORT_REPLY':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'MEETING_UPDATE':
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <span className="font-mono text-[9px] text-brand-primary uppercase tracking-widest block mb-1">
            HAWKEDGE OPERATIONS HUB
          </span>
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-text-primary">
            Alerts & Notifications
          </h1>
          <p className="font-sans text-xs text-text-muted mt-1">
            Realtime audit log events, milestone sign-offs, billing reminders, and support messages.
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-bg-surface border border-border-default hover:border-brand-primary text-text-secondary hover:text-text-primary font-mono text-[9px] uppercase tracking-wider transition-all rounded-xs flex items-center gap-2 flex-shrink-0"
          >
            <CheckCheck className="w-3.5 h-3.5" /> MARK ALL AS READ
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="border border-dashed border-border-default bg-bg-surface/20 text-center py-20 rounded-md">
          <Bell className="w-10 h-10 text-text-muted/50 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-text-primary text-xs uppercase tracking-wider">
            Operational Log Clear
          </h3>
          <p className="font-mono text-[9px] text-text-muted mt-1">
            No notification logs retrieved for this workspace.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 border rounded-sm transition-all flex items-start gap-4 ${
                n.isRead
                  ? 'border-border-subtle/50 bg-bg-surface/10 opacity-75 hover:opacity-100'
                  : 'border-brand-primary/30 bg-brand-primary/5'
              }`}
            >
              <div className={`p-2 bg-bg-base border border-border-subtle rounded-xs flex-shrink-0`}>
                {getNotificationIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-heading text-xs text-text-primary ${n.isRead ? 'font-semibold' : 'font-bold'}`}>
                    {n.title}
                  </h4>
                  <span className="font-mono text-[8px] text-text-muted flex-shrink-0">
                    {new Date(n.createdAt).toLocaleDateString()} &bull; {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  {n.message}
                </p>
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="font-mono text-[8px] text-brand-primary hover:underline inline-flex items-center gap-1 mt-2 uppercase tracking-widest font-bold"
                  >
                    <Eye className="w-3 h-3" /> MARK AS READ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

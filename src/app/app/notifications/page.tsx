'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/Backbutton';
import { notificationApi } from '@/lib/notification-api';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import type { AppNotification } from '@/lib/types';

function timeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const push = usePushNotifications();

  useEffect(() => {
    notificationApi
      .getMine()
      .then(setNotifications)
      .finally(() => setIsLoading(false));
  }, []);

  async function handleMarkAllRead() {
    await notificationApi.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  async function handleClick(n: AppNotification) {
    if (!n.isRead) {
      await notificationApi.markRead(n._id);
      setNotifications((prev) => prev.map((item) => (item._id === n._id ? { ...item, isRead: true } : item)));
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton />
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-medium" style={{ letterSpacing: '-0.02em' }}>
          Notifications
        </h1>
        <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
          Mark all as read
        </Button>
      </div>

      {push.isSupported && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-black/10 p-4 mb-6">
          <div className="flex items-center gap-3">
            {push.isSubscribed ? <Bell className="w-5 h-5 text-black/70" /> : <BellOff className="w-5 h-5 text-black/40" />}
            <div>
              <p className="text-sm font-medium">Browser notifications</p>
              <p className="text-xs text-black/50">Get notified here even when the tab isn&apos;t open.</p>
            </div>
          </div>
          <Button
            variant={push.isSubscribed ? 'secondary' : 'primary'}
            size="sm"
            onClick={push.isSubscribed ? push.unsubscribe : push.subscribe}
            disabled={push.isLoading}
          >
            {push.isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {push.isSubscribed ? 'Disable' : 'Enable'}
          </Button>
        </div>
      )}
      {push.error && <p className="text-sm text-red-600 mb-4">{push.error}</p>}

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-black/40">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-black/50 text-center py-16">You&apos;re all caught up.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <Link
              key={n._id}
              href={n.link || '#'}
              onClick={() => handleClick(n)}
              className={`block rounded-2xl border p-4 transition-colors duration-200 ${
                n.isRead ? 'bg-white border-black/10' : 'bg-black/5 border-black/10'
              }`}
            >
              <p className="font-medium text-sm">{n.title}</p>
              {n.body && <p className="text-sm text-black/60 mt-0.5">{n.body}</p>}
              <p className="text-xs text-black/40 mt-1.5">{timeAgo(n.createdAt)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
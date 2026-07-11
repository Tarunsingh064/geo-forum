import { api } from './api';
import type { AppNotification } from './types';

export const notificationApi = {
  getMine: () => api.get<AppNotification[]>('/notifications'),
  markRead: (id: string) => api.patch<{ message: string }>(`/notifications/${id}/read`),
  markAllRead: () => api.patch<{ message: string }>('/notifications/read-all'),
  subscribePush: (subscription: PushSubscriptionJSON) =>
    api.post<{ message: string }>('/notifications/push-subscribe', subscription),
  unsubscribePush: (endpoint: string) =>
    api.delete<{ message: string }>('/notifications/push-subscribe', { endpoint }),
};

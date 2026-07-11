import { api } from './api';
import type { AdminOverview, AdminUserRow, Post, PostStatus } from './types';

export const adminApi = {

  privacyPolicy: () => api.get<{ content: string }>('/privacy-policy/versions'),

  privacyPolicypost: (content: string) => api.post<{ content: string }>('/privacy-policy/publish', { content }),

  getOverview: () => api.get<AdminOverview>('/admin/overview'),

  getRevenueTimeSeries: (days = 30) =>
    api.get<{ _id: string; totalInPaise: number; count: number }[]>(`/admin/revenue/timeseries?days=${days}`),

  listUsers: (page = 1, limit = 20, q?: string) =>
    api.get<{ users: AdminUserRow[]; total: number; page: number; limit: number }>(
      `/admin/users?page=${page}&limit=${limit}${q ? `&q=${encodeURIComponent(q)}` : ''}`,
    ),

  setUserRole: (userId: string, role: 'user' | 'moderator' | 'admin') =>
    api.patch<AdminUserRow>(`/admin/users/${userId}/role`, { role }),

  banUser: (userId: string, banned: boolean) =>
    api.patch<AdminUserRow>(`/admin/users/${userId}/ban`, { banned }),

  verifyJournalist: (userId: string) =>
    api.patch<AdminUserRow>(`/admin/users/${userId}/verify-journalist`, {}),

  listPosts: (page = 1, limit = 20, status?: PostStatus) =>
    api.get<{ posts: Post[]; total: number; page: number; limit: number }>(
      `/admin/posts?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
    ),
};

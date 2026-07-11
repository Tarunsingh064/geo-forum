import { api } from './api';
import type { Comment, Post, User } from './types';

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  gender?: string;
  expertiseTags?: string[];
}

export const usersApi = {
  getPublicProfile: (id: string) => api.get<Partial<User> & { id: string }>(`/users/${id}`),

  updateProfile: (payload: UpdateProfilePayload) => api.patch<User>('/users/me', payload),

  updateAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post<{ avatarUrl: string }>('/users/me/avatar', formData);
  },

  deactivate: (password: string) => api.post<{ message: string }>('/users/me/deactivate', { password }),

  delete: (password: string) => api.delete<{ message: string }>('/users/me', { password }),

  getMyPosts: () => api.get<Post[]>('/users/me/activity/posts'),
  getMyComments: () => api.get<Comment[]>('/users/me/activity/comments'),
};

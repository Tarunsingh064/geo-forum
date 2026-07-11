import { api } from './api';
import type { PostAuthor } from './types';

export const followApi = {
  followUser: (userId: string) => api.post<{ message: string }>(`/follow/user/${userId}`),
  unfollowUser: (userId: string) => api.delete<{ message: string }>(`/follow/user/${userId}`),
  followTopic: (topic: string) => api.post<{ message: string }>(`/follow/topic/${topic}`),
  unfollowTopic: (topic: string) => api.delete<{ message: string }>(`/follow/topic/${topic}`),
  getFollowers: (userId: string) => api.get<PostAuthor[]>(`/follow/user/${userId}/followers`),
  getFollowing: (userId: string) => api.get<PostAuthor[]>(`/follow/user/${userId}/following`),
};

import { api } from './api';
import type { Post, VoteTargetType, VoteValue } from './types';

export const votesApi = {
  cast: (targetId: string, targetType: VoteTargetType, value: VoteValue) =>
    api.post<{ message: string }>('/votes', { targetId, targetType, value }),

  getMyLikedPosts: () => api.get<Post[]>('/votes/me/liked-posts'),
};

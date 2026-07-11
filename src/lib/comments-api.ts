import { api } from './api';
import type { Comment } from './types';

export const commentsApi = {
  getForPost: (postId: string) => api.get<Comment[]>(`/comments/post/${postId}`),

  create: (postId: string, content: string, parentCommentId?: string) =>
    api.post<Comment>('/comments', { postId, content, parentCommentId }),

  update: (commentId: string, content: string) =>
    api.patch<Comment>(`/comments/${commentId}`, { content }),

  delete: (commentId: string) => api.delete<{ message: string }>(`/comments/${commentId}`),

  getMine: () => api.get<Comment[]>('/comments/me'),
};

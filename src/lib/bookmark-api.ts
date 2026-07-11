import { api } from './api';
import type { Bookmark } from './types';

export const bookmarkApi = {
  toggle: (postId: string) => api.post<{ bookmarked: boolean }>(`/bookmarks/${postId}`),
  getMine: () => api.get<Bookmark[]>('/bookmarks/me'),
};

import { api } from './api';
import type { Category, Feed, Post, PostStatus, PostType } from './types';

export interface CreatePostPayload {
  type: PostType;
  title: string;
  content: string;
  sourceUrl?: string;
  sourceName?: string;
  categories?: Category[];
  tags?: string[];
  status?: 'draft' | 'published';
}

export const postsApi = {
  getFeed: (params: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    type?: PostType;
    sort?: 'latest' | 'trending';
  }) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.category) query.set('category', params.category);
    if (params.tag) query.set('tag', params.tag);
    if (params.type) query.set('type', params.type);
    if (params.sort) query.set('sort', params.sort);
    return api.get<Feed>(`/posts/feed?${query.toString()}`);
  },

  getById: (id: string) => api.get<Post>(`/posts/${id}`),

  create: (payload: CreatePostPayload) => api.post<Post>('/posts', payload),

  update: (id: string, payload: Partial<CreatePostPayload>) => api.patch<Post>(`/posts/${id}`, payload),

  delete: (id: string) => api.delete<{ message: string }>(`/posts/${id}`),

  uploadImages: (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post<{ url: string; publicId: string }[]>(`/posts/${id}/images`, formData);
  },

  getMyPosts: (status?: PostStatus) =>
    api.get<Post[]>(`/posts/me${status ? `?status=${status}` : ''}`),
};
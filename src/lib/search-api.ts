import { api } from './api';
import type { SearchResults } from './types';

export const searchApi = {
  search: (params: { q?: string; category?: string; tag?: string; author?: string }) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.category) query.set('category', params.category);
    if (params.tag) query.set('tag', params.tag);
    if (params.author) query.set('author', params.author);
    return api.get<SearchResults>(`/search?${query.toString()}`);
  },
};

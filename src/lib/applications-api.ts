import { api } from './api';
import type { ContributorApplication } from './types';

export interface ApplyForContributorPayload {
  requestedRole: 'author' | 'journalist';
  motivation: string;
  portfolioLinks?: string[];
}

export const applicationsApi = {
  apply: (payload: ApplyForContributorPayload) =>
    api.post<ContributorApplication>('/contributor-applications', payload),

  getMine: () => api.get<ContributorApplication[]>('/contributor-applications/me'),

  // admin
  getQueue: () => api.get<ContributorApplication[]>('/admin/contributor-applications'),
  approve: (id: string, reviewNotes?: string) =>
    api.patch<ContributorApplication>(`/admin/contributor-applications/${id}/approve`, { reviewNotes }),
  reject: (id: string, reviewNotes?: string) =>
    api.patch<ContributorApplication>(`/admin/contributor-applications/${id}/reject`, { reviewNotes }),
};
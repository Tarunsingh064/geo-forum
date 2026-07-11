import { api } from './api';
import type { Report, ReportReason, ReportStatus } from './types';

export const reportsApi = {
  create: (targetId: string, targetType: 'post' | 'comment' | 'user', reason: ReportReason, details?: string) =>
    api.post<Report>('/reports', { targetId, targetType, reason, details }),

  getAll: (status?: ReportStatus) => api.get<Report[]>(`/reports${status ? `?status=${status}` : ''}`),

  review: (id: string, status: 'reviewed' | 'action_taken' | 'dismissed', reviewNotes?: string) =>
    api.patch<Report>(`/reports/${id}/review`, { status, reviewNotes }),
};

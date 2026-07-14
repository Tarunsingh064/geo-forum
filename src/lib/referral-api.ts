import { api } from './api';
import type { ReferralCode } from './types';

export interface CreateReferralCodePayload {
  role: 'author' | 'journalist';
  note?: string;
  expiresInDays?: number;
}

export const referralApi = {
  create: (payload: CreateReferralCodePayload) => api.post<ReferralCode>('/admin/referral-codes', payload),
  listAll: () => api.get<ReferralCode[]>('/admin/referral-codes'),
  revoke: (id: string) => api.patch<ReferralCode>(`/admin/referral-codes/${id}/revoke`),
};
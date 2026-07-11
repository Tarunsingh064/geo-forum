import { api } from './api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  acceptedPrivacyPolicy: boolean;
}

export const authApi = {
  register: (payload: RegisterPayload) => api.post<{ message: string }>('/auth/register', payload),

  verifyOtp: (email: string, code: string) =>
    api.post<{ message: string }>('/auth/verify-otp', { email, code }),

  resendOtp: (email: string) => api.post<{ message: string }>('/auth/resend-otp', { email }),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/reset-password', { email, code, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/change-password', { currentPassword, newPassword }),
};

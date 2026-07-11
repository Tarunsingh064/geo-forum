import { api } from './api';
import type { CreateOrderResponse, Subscription, SubscriptionPlan } from './types';

export const subscriptionApi = {
  createOrder: (plan: SubscriptionPlan) => api.post<CreateOrderResponse>('/subscription/create-order', { plan }),

  verify: (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    api.post<{ message: string; expiresAt: string }>('/subscription/verify', payload),

  getMine: () => api.get<Subscription[]>('/subscription/me'),
};

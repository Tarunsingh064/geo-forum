import { api } from './api';
import type { CreateOrderResponse, Tip } from './types';

export interface CreateTipOrderPayload {
  recipientId: string;
  amountInPaise: number;
  message?: string;
  postId?: string;
}

export const tipsApi = {
  createOrder: (payload: CreateTipOrderPayload) => api.post<CreateOrderResponse>('/tips/create-order', payload),

  verify: (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    api.post<{ message: string }>('/tips/verify', payload),

  getSent: () => api.get<Tip[]>('/tips/sent'),
  getReceived: () => api.get<Tip[]>('/tips/received'),
};
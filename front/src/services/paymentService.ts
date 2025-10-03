import { api } from '../config/api';
import { PaymentData, PaymentResponse } from '../types';

export const paymentService = {
  processPayment: async (data: PaymentData): Promise<PaymentResponse> => {
    const response = await api.post('/payments/process', data);
    return response.data;
  },

  getPaymentStatus: async (paymentId: string) => {
    const response = await api.get(`/payments/status/${paymentId}`);
    return response.data;
  },
};
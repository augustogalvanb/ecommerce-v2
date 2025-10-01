import { api } from '../config/api';
import { Order, CreateOrderDto, OrderStatus } from '../types';

export const orderService = {
  create: async (data: CreateOrderDto): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getAll: async (status?: OrderStatus): Promise<Order[]> => {
    const params = status ? { status } : {};
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getByOrderNumber: async (orderNumber: string): Promise<Order> => {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};
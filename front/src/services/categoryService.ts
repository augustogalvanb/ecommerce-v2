import { api } from '../config/api';
import { Category } from '../types';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },

  create: async (data: { name: string }): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: { name: string }): Promise<Category> => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
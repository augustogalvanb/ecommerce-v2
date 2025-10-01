import { api } from '../config/api';
import { Product } from '../types';

export const productService = {
  getAll: async (categoryId?: string, isActive?: boolean): Promise<Product[]> => {
    const params: any = {};
    if (categoryId) params.categoryId = categoryId;
    if (isActive !== undefined) params.isActive = isActive;
    
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  create: async (data: FormData): Promise<Product> => {
    const response = await api.post('/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: FormData): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (id: string, imageUrl: string): Promise<void> => {
    await api.delete(`/products/${id}/image`, { data: { imageUrl } });
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
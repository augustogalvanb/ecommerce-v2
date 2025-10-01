import { api } from '../config/api';

interface LoginResponse {
  access_token: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
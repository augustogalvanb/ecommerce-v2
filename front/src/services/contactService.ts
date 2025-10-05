import { api } from '../config/api';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  sendMessage: async (data: ContactFormData) => {
    const response = await api.post('/contact', data);
    return response.data;
  },
};
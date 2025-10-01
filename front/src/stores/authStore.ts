import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      login: (token, admin) => {
        localStorage.setItem('admin_token', token);
        set({ token, admin, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('admin_token');
        set({ token: null, admin: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
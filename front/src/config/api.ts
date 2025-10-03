import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT SOLO si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    
    // Solo agregar token si existe (para rutas de admin)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir a login si:
    // 1. Es error 401
    // 2. Y estamos intentando acceder a una ruta de admin
    // 3. Y hay un token (significa que está expirado)
    if (error.response?.status === 401) {
      const token = localStorage.getItem('admin_token');
      const isAdminRoute = error.config?.url?.includes('/admin') || 
                          window.location.pathname.startsWith('/admin');
      
      // Solo redirigir si es una ruta de admin o había un token
      if (token || isAdminRoute) {
        localStorage.removeItem('admin_token');
        
        // Solo redirigir si NO estamos ya en la página de login
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
import { api } from './api';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (email: string, password: string, username: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', { email, password, username });
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  }
}; 
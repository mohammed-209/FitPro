import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For debugging - remove in production
const logRequest = (config: InternalAxiosRequestConfig) => {
    console.log('Making request to:', config.url);
    console.log('Request method:', config.method);
    console.log('Request headers:', config.headers);
    console.log('Request data:', config.data);
    return config;
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://192.168.50.86:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
  timeout: 10000 // 10 seconds timeout
});

// Add request interceptor for debugging and token
api.interceptors.request.use(async (config) => {
  // Only add Authorization header for non-auth endpoints
  if (!config.url?.startsWith('/auth/')) {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  return config;
});

// Add response interceptor for handling unauthorized responses
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });

    // Only redirect to login for 401 (Unauthorized) errors
    // Don't redirect for 403 (Forbidden) errors as they might be permission-related
    if (error.response?.status === 401) {
      console.log('Unauthorized - redirecting to login');
      // Clear stored auth data
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      
      // Redirect to login
      router.replace('/auth/login');
    }
    return Promise.reject(error);
  }
);

export const signup = async (email: string, username: string, password: string) => {
  try {
    const response = await api.post('/auth/signup', {
      email,
      username,
      password
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Signup error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    throw error;
  }
};

export const login = async (email: string, password: string) => {
    try {
        console.log('Attempting login with email:', email);
        
        const response = await api.post('/auth/login', {
            email,
            password
        });
        
        console.log('Login successful:', response.data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error('Login error full details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        }
        throw error;
    }
};

export const updateProfile = async (profileData: any) => {
  try {
    // Try the alternative endpoint
    const response = await api.put('/api/user/profile', profileData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Profile update error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.config?.headers,
        url: error.config?.url
      });
    }
    throw error;
  }
};

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api; 
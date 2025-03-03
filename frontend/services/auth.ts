import { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

interface AuthResponse {
  token: string;
  username: string;
  profile?: UserProfile;
}

interface UserProfile {
  age: string;
  weight: string;
  height: string;
  gender: string;
  fitnessLevel: string;
  fitnessGoals: string;
}

interface ProfileResponse {
  profile: UserProfile;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Clear any existing tokens before login
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];

      console.log('Attempting login with:', { email });
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        return response.data;
      }
      throw new Error('No token in response');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Login error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
      }
      throw error;
    }
  },

  async signup(email: string, password: string, username: string): Promise<AuthResponse> {
    try {
      // Clear any existing tokens before signup
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];

      console.log('Attempting signup with:', { email, username });
      const response = await api.post('/auth/signup', { email, password, username });
      
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        // Set the token in api defaults
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return response.data;
      }
      throw new Error('No token in response');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Signup error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
      }
      throw error;
    }
  },

  async updateProfile(profileData: UserProfile): Promise<ProfileResponse> {
    try {
      const token = await this.getToken();
      console.log('Attempting to update profile:', {
        data: profileData,
        token: token ? 'Token exists' : 'No token'
      });

      // Make sure token is set in headers
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      // Use the correct endpoint
      const response = await api.post('/api/users/profile', profileData);
      
      if (response.data) {
        // Update the stored user data with the new profile
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.profile = response.data.profile;
          await AsyncStorage.setItem('user', JSON.stringify(userData));
        }
      }

      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Profile update error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
          headers: error.config?.headers
        });

        // Throw a more specific error message
        if (error.response?.status === 403) {
          throw new Error('Unable to update profile. Please try logging in again.');
        }
      }
      throw error;
    }
  },

  async logout() {
    await AsyncStorage.removeItem('token');
  },

  async getToken() {
    return await AsyncStorage.getItem('token');
  },

  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }
}; 
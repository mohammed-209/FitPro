import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { setAuthToken } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface User {
  id: string;
  email: string;
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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setAuthToken(storedToken);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      const userData = {
        id: email,
        email: email,
        username: response.username,
        profile: response.profile
      };
      setUser(userData);
      setAuthToken(response.token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', response.token);

      // Check if user has a profile and redirect accordingly
      if (!response.profile) {
        router.replace('/auth/profile-setup');
      } else {
        router.replace('/(app)/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      const response = await authService.signup(email, password, username);
      const userData = {
        id: email,
        email: email,
        username: response.username
      };
      setUser(userData);
      setAuthToken(response.token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', response.token);
      // After successful signup, redirect to profile setup
      router.replace('/auth/profile-setup');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: UserProfile) => {
    if (!user) return;
    try {
      const response = await authService.updateProfile(profileData);
      const updatedUser: User = {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: response.profile
      };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setAuthToken('');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
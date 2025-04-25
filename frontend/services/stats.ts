import { getAuthToken } from './auth';
import api from './api';
import { AxiosError } from 'axios';

export interface UserStats {
  id: string;
  weight: number | null;
  height: number | null;
  bodyFatPercentage: number | null;
  measurementDate: string;
}

export interface RecordStatsData {
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  measurementDate?: Date;
}

class StatsService {
  async recordStats(data: RecordStatsData): Promise<UserStats> {
    try {
      // Format the date to ISO string if it exists
      const formattedData = {
        ...data,
        measurementDate: data.measurementDate ? new Date(data.measurementDate.getTime() - (data.measurementDate.getTimezoneOffset() * 60000)).toISOString() : undefined
      };
      const response = await api.post('/api/stats', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error recording stats:', error);
      throw new Error('Failed to record stats');
    }
  }

  async getLatestStats(): Promise<UserStats | null> {
    try {
      console.log('Fetching latest stats...');
      const response = await api.get('/api/stats/latest');
      console.log('Latest stats fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      if ((error as AxiosError)?.response?.status === 404) {
        console.log('No stats data found for user, returning null');
        return null;
      }
      console.error('Error fetching latest stats:', error);
      throw error;
    }
  }

  async getWeightProgress(): Promise<UserStats[]> {
    try {
      const response = await api.get('/api/stats/progress/weight');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch weight progress');
    }
  }
}

export const statsService = new StatsService(); 
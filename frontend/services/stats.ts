import { getAuthToken } from './auth';
import api from './api';
import { AxiosError } from 'axios';

export interface UserStats {
  id: string;
  weight: number | null;
  measurementDate: string;
}

export interface RecordStatsData {
  weight?: number;
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
      const response = await api.get('/api/stats/latest');
      return response.data;
    } catch (error) {
      if ((error as AxiosError)?.response?.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch latest stats');
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
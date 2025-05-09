import api from './api';

export interface WorkoutStats {
  streak: number;
  totalWorkouts: number;
  lastWorkoutDate?: string;
  lastWorkoutMuscleGroup?: string;
}

export interface WorkoutHistory {
  id: string;
  workoutDate: string;
  muscleGroup: string;
  durationMinutes: number;
  completed: boolean;
  exercises: Record<string, number>;
}

class WorkoutService {
  async getWorkoutStats(): Promise<WorkoutStats> {
    try {
      const response = await api.get('/api/workouts/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching workout stats:', error);
      return { streak: 0, totalWorkouts: 0 };
    }
  }

  async getWorkoutHistory(): Promise<WorkoutHistory[]> {
    try {
      const response = await api.get('/api/workouts');
      return response.data;
    } catch (error) {
      console.error('Error fetching workout history:', error);
      return [];
    }
  }

  async saveWorkout(workoutData: any): Promise<WorkoutHistory> {
    try {
      console.log('Sending workout data to API:', workoutData);
      const response = await api.post('/api/workouts', workoutData);
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error saving workout (detail):', error);
      throw new Error('Failed to save workout');
    }
  }
}

export const workoutService = new WorkoutService(); 
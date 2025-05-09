import { useState, useCallback, useEffect } from 'react';
import { workoutService, WorkoutStats, WorkoutHistory } from '../services/workout';

export const useWorkouts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats>({ streak: 0, totalWorkouts: 0 });
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>([]);

  const fetchWorkoutStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await workoutService.getWorkoutStats();
      setWorkoutStats(stats);
      return stats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workout stats');
      console.error('Error fetching workout stats:', err);
      return { streak: 0, totalWorkouts: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWorkoutHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const history = await workoutService.getWorkoutHistory();
      setWorkoutHistory(history);
      return history;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workout history');
      console.error('Error fetching workout history:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    workoutStats,
    workoutHistory,
    fetchWorkoutStats,
    fetchWorkoutHistory
  };
}; 
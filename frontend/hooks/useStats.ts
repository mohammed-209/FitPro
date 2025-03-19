import { useState, useCallback } from 'react';
import { statsService, UserStats, RecordStatsData } from '../services/stats';

export const useStats = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestStats, setLatestStats] = useState<UserStats | null>(null);
  const [weightData, setWeightData] = useState<UserStats[]>([]);

  const recordStats = useCallback(async (data: RecordStatsData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await statsService.recordStats(data);
      setLatestStats(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record stats');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLatestStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statsService.getLatestStats();
      setLatestStats(stats);
      return stats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch latest stats');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeightProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const progress = await statsService.getWeightProgress();
      setWeightData(progress);
      return progress;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weight progress');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    latestStats,
    weightData,
    recordStats,
    fetchLatestStats,
    fetchWeightProgress,
  };
}; 
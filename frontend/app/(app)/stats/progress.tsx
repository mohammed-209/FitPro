import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useStats } from '../../../hooks/useStats';
import { StatsChart } from '../../../components/stats/StatsChart';
import { AddMeasurementForm } from '../../../components/stats/AddMeasurementForm';
import { UNITS } from '../../../utils/constants';
import { UserStats } from '../../../services/stats';

export default function ProgressScreen() {
  const { loading, error, fetchWeightProgress } = useStats();
  const [weightData, setWeightData] = useState<UserStats[]>([]);

  const loadData = async () => {
    try {
      const weightProgress = await fetchWeightProgress();
      setWeightData(weightProgress);
    } catch (err) {
      console.error('Error loading progress data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [fetchWeightProgress]);

  if (loading && !weightData.length) {
    return (
      <View style={[styles.centered, { backgroundColor: '#121212' }]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: '#121212' }]}>
        <Text style={{ color: '#ff6b6b' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#121212' }]}>
      <AddMeasurementForm onSuccess={loadData} />
      
      <StatsChart
        data={weightData}
        title="Weight Progress"
        valueKey="weight"
        unit={UNITS.WEIGHT}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 
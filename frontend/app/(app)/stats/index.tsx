import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, useTheme, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { useStats } from '../../../hooks/useStats';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UNITS } from '../../../utils/constants';

// Temporary formatter function until we can fix the import
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function StatsScreen() {
  const theme = useTheme();
  const { latestStats, fetchLatestStats, loading, error } = useStats();
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadStats = async () => {
      try {
        setFetchError(null);
        await fetchLatestStats();
      } catch (err) {
        console.error('Error fetching stats:', err);
        setFetchError('Unable to load your stats. Please try again later.');
      }
    };
    
    loadStats();
  }, [fetchLatestStats]);

  // Function to calculate BMI if weight and height are available
  const calculateBMI = () => {
    if (!latestStats?.weight || !latestStats?.height) return null;
    const heightInMeters = latestStats.height / 100; // Convert cm to m
    const bmi = latestStats.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: theme.colors.tertiary };
    if (bmi < 25) return { category: 'Normal weight', color: theme.colors.primary };
    if (bmi < 30) return { category: 'Overweight', color: theme.colors.secondary };
    return { category: 'Obese', color: theme.colors.error };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  const StatItem = ({ label, value, icon }: { label: string; value: string | null; icon: string }) => (
    <Surface style={styles.statItem} elevation={1}>
      <MaterialCommunityIcons name={icon as any} size={24} color={theme.colors.primary} />
      <View style={styles.statContent}>
        <Text variant="bodyMedium" style={styles.label}>{label}</Text>
        <Text variant="titleMedium" style={styles.value}>{value || 'Not recorded'}</Text>
      </View>
    </Surface>
  );

  return (
    <ScrollView style={styles.container}>
      {fetchError ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.error}>{fetchError}</Text>
            <Button 
              mode="contained" 
              onPress={() => fetchLatestStats()}
              style={styles.button}
              loading={loading}
            >
              Retry
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Card.Title title="Body Measurements" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.statsGrid}>
              <StatItem 
                label="Weight" 
                value={latestStats?.weight ? `${latestStats.weight} ${UNITS.WEIGHT}` : null} 
                icon="scale-bathroom"
              />
              <StatItem 
                label="Height" 
                value={latestStats?.height ? `${latestStats.height} ${UNITS.HEIGHT}` : null} 
                icon="human-male-height" 
              />
              <StatItem 
                label="Body Fat" 
                value={latestStats?.bodyFatPercentage ? `${latestStats.bodyFatPercentage}%` : null} 
                icon="percent" 
              />
            </View>

            {bmi && (
              <View style={styles.bmiContainer}>
                <Text variant="titleMedium" style={styles.bmiLabel}>BMI</Text>
                <Text variant="headlineMedium" style={[styles.bmiValue, { color: bmiCategory?.color }]}>{bmi}</Text>
                <Text variant="bodySmall" style={styles.bmiCategory}>{bmiCategory?.category}</Text>
              </View>
            )}

            {latestStats && latestStats.measurementDate && (
              <Text variant="bodySmall" style={styles.timestamp}>
                Last recorded: {formatDate(latestStats.measurementDate)}
              </Text>
            )}
            
            <Button 
              mode="contained"
              onPress={() => router.push('/stats/progress')}
              style={styles.button}
              icon="chart-line"
            >
              View Progress
            </Button>
            
            <Button 
              mode="outlined"
              onPress={() => router.push('/stats/record')}
              style={styles.button}
              icon="pencil"
            >
              Record New Measurement
            </Button>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  card: {
    margin: 16,
    backgroundColor: '#1C1C1E',
  },
  cardTitle: {
    color: '#fff',
  },
  statsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
  },
  statContent: {
    marginLeft: 12,
  },
  label: {
    color: '#8E8E93',
  },
  value: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bmiContainer: {
    alignItems: 'center',
    marginVertical: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
  },
  bmiLabel: {
    color: '#8E8E93',
    marginBottom: 4,
  },
  bmiValue: {
    fontWeight: 'bold',
    fontSize: 48,
  },
  bmiCategory: {
    color: '#8E8E93',
  },
  timestamp: {
    textAlign: 'center',
    color: '#8E8E93',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  error: {
    color: '#FF453A',
    textAlign: 'center',
    marginBottom: 16,
  },
});

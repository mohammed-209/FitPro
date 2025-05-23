import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Button, IconButton, Surface, useTheme, Avatar } from 'react-native-paper';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useStats } from '../../hooks/useStats';
import { useWorkouts } from '../../hooks/useWorkouts';
import { UNITS } from '../../utils/constants';

export default function Home() {
  const theme = useTheme();
  const { user } = useAuth();
  const { latestStats, fetchLatestStats } = useStats();
  const { workoutStats, fetchWorkoutStats } = useWorkouts();

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchLatestStats();
        await fetchWorkoutStats();
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    
    loadData();
  }, [fetchLatestStats, fetchWorkoutStats]);

  // Mock user stats (keeping some stats as mock for now)
  const userStats = {
    maxBench: '225 lbs',
    maxSquat: '315 lbs',
  };

  const StatCard = ({ title, value, icon, onPress }: { title: string; value: string; icon: string; onPress?: () => void }) => (
    <Surface style={[styles.statCard, onPress && styles.pressable]} elevation={1} onTouchEnd={onPress}>
      <MaterialCommunityIcons name={icon as any} size={24} color={theme.colors.primary} />
      <Text variant="titleLarge" style={styles.statValue}>{value}</Text>
      <Text variant="bodySmall">{title}</Text>
    </Surface>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineSmall" style={styles.headerText}>Welcome back,</Text>
          <Text variant="headlineMedium" style={styles.userName}>{user?.username || 'User'}</Text>
        </View>
        <IconButton
          icon="account"
          size={30}
          iconColor="#fff"
          onPress={() => router.push('/profile')}
        />
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard title="Streak" value={`${workoutStats.streak || 0} days`} icon="fire" />
        <StatCard 
          title="Weight" 
          value={latestStats?.weight ? `${latestStats.weight} ${UNITS.WEIGHT}` : 'Not set'} 
          icon="scale-bathroom" 
          onPress={() => router.push('/stats/progress')}
        />
        <StatCard title="Workouts" value={workoutStats.totalWorkouts?.toString() || '0'} icon="dumbbell" />
      </View>

      {/* Start Workout Section */}
      <Card style={styles.card}>
        <Card.Title 
          title="Start Workout" 
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Button 
            mode="contained"
            icon="plus"
            onPress={() => router.push('/workouts/generate')}
            style={styles.button}
          >
            Generate Workout
          </Button>
          <Button 
            mode="outlined"
            icon="playlist-check"
            onPress={() => router.push('/workouts/templates')}
            style={styles.button}
          >
            Use Template
          </Button>
        </Card.Content>
      </Card>

      {/* Personal Records */}
      <Card style={styles.card}>
        <Card.Title 
          title="Personal Records" 
          titleStyle={styles.cardTitle}
          right={(props) => (
            <IconButton {...props} icon="chevron-right" iconColor="#fff" onPress={() => router.push('/profile/records')} />
          )}
        />
        <Card.Content>
          <View style={styles.recordItem}>
            <MaterialCommunityIcons name="arm-flex" size={24} color={theme.colors.primary} />
            <View style={styles.recordText}>
              <Text variant="bodyLarge" style={styles.textLight}>Bench Press</Text>
              <Text variant="bodyMedium" style={styles.textLight}>{userStats.maxBench}</Text>
            </View>
          </View>
          <View style={styles.recordItem}>
            <MaterialCommunityIcons name="human" size={24} color={theme.colors.primary} />
            <View style={styles.recordText}>
              <Text variant="bodyLarge" style={styles.textLight}>Squat</Text>
              <Text variant="bodyMedium" style={styles.textLight}>{userStats.maxSquat}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Goals Section */}
      <Card style={styles.card}>
        <Card.Title 
          title="Active Goals"
          titleStyle={styles.cardTitle}
          right={(props) => (
            <IconButton {...props} icon="plus" iconColor="#fff" onPress={() => router.push('/goals/create')} />
          )}
        />
        <Card.Content>
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Text variant="bodyLarge" style={styles.textLight}>Bench Press Goal</Text>
              <Text variant="bodyMedium" style={styles.textLight}>80% Complete</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '80%' }]} />
            </View>
          </View>
          <Button 
            mode="text"
            onPress={() => router.push('/goals')}
            style={styles.button}
            textColor="#fff"
          >
            View All Goals
          </Button>
        </Card.Content>
      </Card>

      {/* Social Section */}
      <Card style={styles.card}>
        <Card.Title 
          title="Social" 
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <Button 
            mode="outlined"
            icon="account-group"
            onPress={() => router.push('/social')}
            style={styles.button}
          >
            View Challenges
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    color: '#fff',
  },
  userName: {
    fontWeight: 'bold',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    margin: 4,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
  },
  statValue: {
    marginVertical: 4,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1C1C1E',
  },
  button: {
    marginVertical: 4,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  recordText: {
    marginLeft: 12,
  },
  goalItem: {
    marginVertical: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  cardTitle: {
    color: '#fff',
  },
  textLight: {
    color: '#fff',
  },
  pressable: {
    opacity: 0.8,
  },
}); 
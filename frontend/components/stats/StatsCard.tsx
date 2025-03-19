import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = 'scale' | 'human-male-height' | 'percent' | 'calculator';

interface StatsCardProps {
  title: string;
  value: string | number | null;
  unit?: string;
  icon: IconName;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, icon }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <MaterialCommunityIcons 
          name={icon} 
          size={24} 
          color={theme.colors.primary} 
          style={styles.icon}
        />
        <Text variant="titleMedium" style={styles.title}>{title}</Text>
        <Text variant="headlineMedium" style={styles.value}>
          {value !== null ? value : '-'}{unit ? ` ${unit}` : ''}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    textAlign: 'center',
  },
}); 
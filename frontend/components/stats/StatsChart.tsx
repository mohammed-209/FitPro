import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme, SegmentedButtons } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import { UserStats } from '../../services/stats';

type DateRange = 'week' | 'month' | 'year';

interface ChartDataPoint {
  value: number;
  label: string;
  labelComponent?: () => JSX.Element;
}

export const StatsChart: React.FC<{
  data: UserStats[];
  title: string;
  unit: string;
  valueKey: keyof UserStats;
}> = ({
  data,
  title,
  unit,
  valueKey,
}) => {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState<DateRange>('week');

  const filterDataByDateRange = (data: UserStats[], range: DateRange) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return data.filter(stat => 
      new Date(stat.measurementDate) >= startDate
    );
  };

  const formatDate = (date: Date) => {
    switch (dateRange) {
      case 'week':
        return `${date.getMonth() + 1}/${date.getDate()}`;
      case 'month':
        return `${date.getMonth() + 1}/${date.getDate()}`;
      case 'year':
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };

  const chartData = useMemo(() => {
    if (!data.length) return [];
    const filteredData = filterDataByDateRange(data, dateRange);
    
    return filteredData
      .map(stat => ({
        value: Number(stat[valueKey]) || 0,
        label: new Date(stat.measurementDate).getDate().toString(),
        labelComponent: () => (
          <Text style={[styles.label, { color: '#666' }]}>
            {formatDate(new Date(stat.measurementDate))}
          </Text>
        ),
      }))
      .sort((a, b) => {
        const dateA = new Date(filteredData.find(d => Number(d[valueKey]) === a.value)?.measurementDate || '');
        const dateB = new Date(filteredData.find(d => Number(d[valueKey]) === b.value)?.measurementDate || '');
        return dateA.getTime() - dateB.getTime();
      });
  }, [data, dateRange, valueKey]);

  if (!chartData.length) {
    return (
      <View style={[styles.container, { backgroundColor: '#1C1C1E' }]}>
        <Text style={{ color: '#fff' }}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#1C1C1E' }]}>
      <Text variant="titleMedium" style={[styles.title, { color: '#fff' }]}>{title}</Text>
      
      <SegmentedButtons
        value={dateRange}
        onValueChange={value => setDateRange(value as DateRange)}
        buttons={[
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'year', label: 'Year' },
        ]}
        style={styles.segmentedButtons}
      />

      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 120}
        height={220}
        spacing={40}
        color="#2196F3"
        thickness={2.5}
        areaChart
        startFillColor="#2196F3"
        endFillColor="#2196F3"
        startOpacity={0.2}
        endOpacity={0.0}
        initialSpacing={20}
        endSpacing={20}
        yAxisLabelSuffix={unit}
        yAxisTextStyle={[styles.yAxis, { color: '#666' }]}
        xAxisLabelTextStyle={[styles.xAxis, { color: '#666' }]}
        yAxisColor="#2C2C2E"
        xAxisColor="#2C2C2E"
        rulesType="solid"
        rulesColor="#2C2C2E"
        hideRules={false}
        hideDataPoints={false}
        dataPointsColor="#2196F3"
        curved
        adjustToWidth
        noOfSections={6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    padding: 24,
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  title: {
    marginBottom: 16,
    fontWeight: '600',
  },
  segmentedButtons: {
    marginBottom: 24,
    backgroundColor: '#2C2C2E',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  yAxis: {
    fontSize: 12,
  },
  xAxis: {
    fontSize: 12,
    width: 40,
    marginLeft: -20,
  },
}); 
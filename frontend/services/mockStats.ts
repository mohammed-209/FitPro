import { UserStats } from './stats';

// Generate dates for the last 7 days
const generateDates = (count: number) => {
  const dates: Date[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date);
  }
  return dates;
};

// Generate mock weight data with a slight downward trend
const generateWeightData = (): UserStats[] => {
  const dates = generateDates(7);
  const baseWeight = 175;
  
  return dates.map((date, index) => ({
    id: `weight-${index}`,
    weight: baseWeight - (index * 0.2), // Slight decrease each day
    height: 70, // 5'10" in inches
    bodyFatPercentage: null,
    measurementDate: date.toISOString(),
    bmi: 25.1,
  }));
};

// Generate mock body fat data with a slight downward trend
const generateBodyFatData = (): UserStats[] => {
  const dates = generateDates(7);
  const baseBodyFat = 20;
  
  return dates.map((date, index) => ({
    id: `bodyfat-${index}`,
    weight: null,
    height: null,
    bodyFatPercentage: baseBodyFat - (index * 0.1), // Slight decrease each day
    measurementDate: date.toISOString(),
  }));
};

class MockStatsService {
  async getWeightProgress(): Promise<UserStats[]> {
    return generateWeightData();
  }

  async getBodyFatProgress(): Promise<UserStats[]> {
    return generateBodyFatData();
  }

  async getLatestStats(): Promise<UserStats> {
    const weightData = generateWeightData();
    return weightData[weightData.length - 1];
  }
}

export const mockStatsService = new MockStatsService(); 
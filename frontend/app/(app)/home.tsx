import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Button, Searchbar, Card, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search workouts"
          style={styles.searchBar}
          placeholderTextColor="#999"
          iconColor="#fff"
          inputStyle={{ color: '#fff' }}
          icon="magnify"
          right={(props) => <Button {...props} icon="filter" mode="text" textColor="#fff" />}
        />

        <ScrollView style={styles.content}>
          <View style={styles.categories}>
            <Button 
              mode="contained" 
              style={[styles.categoryButton, styles.greenButton]}
              labelStyle={styles.buttonLabel}
            >
              Home Fitplans
            </Button>
            <Button 
              mode="contained" 
              style={[styles.categoryButton, styles.greenButton]}
              labelStyle={styles.buttonLabel}
            >
              Gym Fitplans
            </Button>
            <Button 
              mode="contained" 
              style={[styles.categoryButton, styles.blueButton]}
              labelStyle={styles.buttonLabel}
            >
              Free Workouts
            </Button>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="titleLarge" style={styles.sectionTitle}>Featured Workouts</Text>
              <Button mode="text" textColor="#fff">See all</Button>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Card style={styles.workoutCard}>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                <Card.Title 
                  title="8 Minute Abs" 
                  subtitle="Jen Selter"
                  titleStyle={styles.cardTitle}
                  subtitleStyle={styles.cardSubtitle}
                />
              </Card>
              <Card style={styles.workoutCard}>
                <Card.Cover source={{ uri: 'https://picsum.photos/701' }} />
                <Card.Title 
                  title="7 Minutes to Stronger" 
                  subtitle="Strong Nation"
                  titleStyle={styles.cardTitle}
                  subtitleStyle={styles.cardSubtitle}
                />
              </Card>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
  },
  content: {
    flex: 1,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    borderRadius: 12,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 13,
  },
  greenButton: {
    backgroundColor: '#4CAF50',
  },
  blueButton: {
    backgroundColor: '#2196F3',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  workoutCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#1C1C1E',
  },
  cardTitle: {
    color: '#fff',
  },
  cardSubtitle: {
    color: '#999',
  },
}); 
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Avatar, IconButton } from 'react-native-paper';
import { useAuth } from '../../../contexts/AuthContext';
import { router } from 'expo-router';

export default function Profile() {
  const { user } = useAuth();

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={getInitials(user?.username || 'U')} 
          style={styles.avatar}
        />
        <Text variant="headlineMedium" style={styles.username}>
          {user?.username}
        </Text>
        <Text variant="bodyLarge" style={styles.email}>
          {user?.email}
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Title 
          title="Profile Information"
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Age</Text>
            <Text style={styles.value}>{user?.profile?.age || 'Not set'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Weight</Text>
            <Text style={styles.value}>
              {user?.profile?.weight ? `${user.profile.weight} lbs` : 'Not set'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Height</Text>
            <Text style={styles.value}>
              {user?.profile?.height ? `${user.profile.height} ft` : 'Not set'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>
              {user?.profile?.gender ? 
                user.profile.gender.charAt(0).toUpperCase() + user.profile.gender.slice(1) : 
                'Not set'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title 
          title="Fitness Profile" 
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Fitness Level</Text>
            <Text style={styles.value}>
              {user?.profile?.fitnessLevel ? 
                user.profile.fitnessLevel.charAt(0).toUpperCase() + user.profile.fitnessLevel.slice(1) : 
                'Not set'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Primary Goal</Text>
            <Text style={styles.value}>
              {user?.profile?.fitnessGoals ? 
                user.profile.fitnessGoals.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ') : 
                'Not set'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => router.push('/profile/edit')}
        style={styles.editButton}
      >
        Edit Profile
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: '#1C1C1E',
  },
  username: {
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    color: '#888',
    marginBottom: 20,
  },
  card: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#1C1C1E',
  },
  cardTitle: {
    color: '#fff',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  label: {
    color: '#888',
    flex: 1,
  },
  value: {
    color: '#fff',
    flex: 2,
    textAlign: 'right',
  },
  editButton: {
    margin: 16,
    marginTop: 8,
  },
}); 
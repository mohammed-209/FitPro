import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, SegmentedButtons } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileSetup() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [profileData, setProfileData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    fitnessLevel: 'beginner',
    fitnessGoals: 'strength',
  });

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!profileData.age || !profileData.weight || !profileData.height) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting profile data:', profileData);
      await updateProfile(profileData);
      console.log('Profile updated successfully');
      router.replace('/(app)/home');
    } catch (err) {
      console.error('Profile setup error:', err);
      if (err instanceof Error) {
        // Show a more user-friendly error message
        setError(
          'Unable to save profile. Please try again. ' +
          (err.message.includes('403') ? 'Session may have expired.' : '')
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Complete Your Profile</Text>
      
      <TextInput
        label="Age"
        value={profileData.age}
        onChangeText={(value) => handleChange('age', value)}
        keyboardType="numeric"
        style={styles.input}
        disabled={loading}
      />

      <TextInput
        label="Weight (kg)"
        value={profileData.weight}
        onChangeText={(value) => handleChange('weight', value)}
        keyboardType="numeric"
        style={styles.input}
        disabled={loading}
      />

      <TextInput
        label="Height (cm)"
        value={profileData.height}
        onChangeText={(value) => handleChange('height', value)}
        keyboardType="numeric"
        style={styles.input}
        disabled={loading}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>Gender</Text>
      <SegmentedButtons
        value={profileData.gender}
        onValueChange={value => handleChange('gender', value)}
        buttons={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' }
        ]}
        style={styles.segmentedButton}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>Fitness Level</Text>
      <SegmentedButtons
        value={profileData.fitnessLevel}
        onValueChange={value => handleChange('fitnessLevel', value)}
        buttons={[
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' }
        ]}
        style={styles.segmentedButton}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>Primary Goal</Text>
      <SegmentedButtons
        value={profileData.fitnessGoals}
        onValueChange={value => handleChange('fitnessGoals', value)}
        buttons={[
          { value: 'strength', label: 'Strength' },
          { value: 'weight_loss', label: 'Weight Loss' },
          { value: 'muscle_gain', label: 'Muscle Gain' }
        ]}
        style={styles.segmentedButton}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Complete Profile
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  title: {
    textAlign: 'center',
    marginVertical: 24,
    color: '#fff',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1C1C1E',
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: '#fff',
  },
  segmentedButton: {
    marginBottom: 16,
  },
}); 
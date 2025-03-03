import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, SegmentedButtons } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';

export default function ProfileEdit() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [profileData, setProfileData] = useState({
    age: user?.profile?.age || '',
    weight: user?.profile?.weight || '',
    height: user?.profile?.height || '',
    gender: user?.profile?.gender || 'male',
    fitnessLevel: user?.profile?.fitnessLevel || 'beginner',
    fitnessGoals: user?.profile?.fitnessGoals || 'strength',
  });

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateProfile(profileData);
      router.back();
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Edit Profile</Text>
      
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

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={[styles.button, styles.cancelButton]}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Save Changes
        </Button>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: '#fff',
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
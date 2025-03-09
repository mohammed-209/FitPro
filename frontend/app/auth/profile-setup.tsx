import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, SegmentedButtons, Portal, Modal, TouchableRipple } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Picker } from '@react-native-picker/picker';

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const fitnessGoals = [
  { value: 'strength', label: 'Strength' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' }
];

export default function ProfileSetup() {
  const { updateProfile, user } = useAuth();
  const { mode } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [heightModalVisible, setHeightModalVisible] = useState(false);
  
  const isEditMode = mode === 'edit';

  // Convert height from total inches to feet and inches
  const getHeightParts = (totalInches: string) => {
    if (!totalInches) return { feet: '5', inches: '8' };
    const total = parseInt(totalInches);
    return {
      feet: Math.floor(total / 12).toString(),
      inches: (total % 12).toString()
    };
  };

  const [profileData, setProfileData] = useState({
    age: user?.profile?.age || '',
    weight: user?.profile?.weight || '',
    ...getHeightParts(user?.profile?.height || ''),
    gender: user?.profile?.gender || 'male',
    fitnessLevel: user?.profile?.fitnessLevel || 'beginner',
    fitnessGoals: user?.profile?.fitnessGoals || 'strength'
  });

  // Generate height options
  const feetOptions = Array.from({ length: 8 }, (_, i) => (i + 4).toString());
  const inchesOptions = Array.from({ length: 12 }, (_, i) => i.toString());

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    if (!profileData.age || !profileData.weight) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const totalInches = (parseInt(profileData.feet) * 12) + parseInt(profileData.inches);
      
      await updateProfile({
        age: profileData.age,
        height: totalInches.toString(),
        weight: profileData.weight,
        gender: profileData.gender,
        fitnessLevel: profileData.fitnessLevel,
        fitnessGoals: profileData.fitnessGoals
      });
      
      if (isEditMode) {
        router.back();
      } else {
        router.replace('/(app)/home');
      }
    } catch (err) {
      console.error('Profile setup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {isEditMode ? 'Edit Profile' : 'Complete Your Profile'}
      </Text>
      
      <TextInput
        label="Age"
        value={profileData.age}
        onChangeText={(value) => handleChange('age', value)}
        keyboardType="numeric"
        style={styles.input}
        disabled={loading}
      />

      <View style={styles.heightContainer}>
        <TouchableRipple
          onPress={() => setHeightModalVisible(true)}
          style={styles.heightButton}
        >
          <View style={styles.heightButtonContent}>
            <Text style={styles.heightButtonLabel}>Height</Text>
            <Text style={styles.heightValue}>{`${profileData.feet}' ${profileData.inches}"`}</Text>
          </View>
        </TouchableRipple>
      </View>

      <TextInput
        label="Weight (lbs)"
        value={profileData.weight}
        onChangeText={(value) => handleChange('weight', value)}
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
          { value: 'female', label: 'Female' }
        ]}
        style={styles.segmentedButton}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>Fitness Level</Text>
      <SegmentedButtons
        value={profileData.fitnessLevel}
        onValueChange={value => handleChange('fitnessLevel', value)}
        buttons={fitnessLevels}
        style={styles.segmentedButton}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>Primary Goal</Text>
      <SegmentedButtons
        value={profileData.fitnessGoals}
        onValueChange={value => handleChange('fitnessGoals', value)}
        buttons={fitnessGoals}
        style={styles.segmentedButton}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isEditMode ? (
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
      ) : (
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={[styles.button, { marginTop: 24 }]}
          loading={loading}
          disabled={loading}
        >
          Complete Setup
        </Button>
      )}

      <Portal>
        <Modal
          visible={heightModalVisible}
          onDismiss={() => setHeightModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>Select Height</Text>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Feet</Text>
              <Picker
                selectedValue={profileData.feet}
                onValueChange={(value) => handleChange('feet', value)}
                style={styles.picker}
                dropdownIconColor="#fff"
                itemStyle={{ color: '#fff' }}
              >
                {feetOptions.map(feet => (
                  <Picker.Item key={feet} label={`${feet}'`} value={feet} color="#fff" />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Inches</Text>
              <Picker
                selectedValue={profileData.inches}
                onValueChange={(value) => handleChange('inches', value)}
                style={styles.picker}
                dropdownIconColor="#fff"
                itemStyle={{ color: '#fff' }}
              >
                {inchesOptions.map(inch => (
                  <Picker.Item key={inch} label={`${inch}"`} value={inch} color="#fff" />
                ))}
              </Picker>
            </View>
          </View>
          <Button 
            mode="contained" 
            onPress={() => setHeightModalVisible(false)}
            style={{ marginTop: 16 }}
          >
            Done
          </Button>
        </Modal>
      </Portal>
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
    marginBottom: 40,
  },
  error: {
    color: '#cf6679',
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
  heightContainer: {
    marginBottom: 16,
  },
  heightButton: {
    backgroundColor: '#1C1C1E',
    height: 56,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingTop: 6,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  heightButtonContent: {
    height: '100%',
  },
  heightButtonLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  heightValue: {
    color: '#fff',
    fontSize: 16,
    position: 'absolute',
    bottom: 8,
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  pickerWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  pickerLabel: {
    marginBottom: 8,
    color: '#fff',
  },
  picker: {
    width: 120,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  cancelButton: {
    borderColor: '#fff',
  },
}); 
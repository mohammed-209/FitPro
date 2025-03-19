import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInput, Button, Text, Portal, Modal } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useStats } from '../../hooks/useStats';
import { UNITS } from '../../utils/constants';

interface AddMeasurementFormProps {
  onSuccess?: () => void;
}

export const AddMeasurementForm: React.FC<AddMeasurementFormProps> = ({ onSuccess }) => {
  const { recordStats, loading, error, fetchWeightProgress } = useStats();
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    try {
      // Use the selected date directly without modifying its time
      await recordStats({
        weight: weight ? parseFloat(weight) : undefined,
        measurementDate: date,
      });
      setWeight('');
      setDate(new Date());
      await fetchWeightProgress();
      onSuccess?.();
    } catch (err) {
      console.error('Error recording stats:', err);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      // Create a new Date object to avoid reference issues
      const newDate = new Date(selectedDate);
      setDate(newDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>Add New Weight</Text>
      
      <TextInput
        label={`Weight (${UNITS.WEIGHT})`}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        style={styles.input}
        mode="outlined"
        theme={{ colors: { background: '#1C1C1E' } }}
      />

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
        textColor="#fff"
      >
        {formatDate(date)}
      </Button>

      {showDatePicker && (
        <>
          {Platform.OS === 'ios' ? (
            <Portal>
              <Modal
                visible={showDatePicker}
                onDismiss={() => setShowDatePicker(false)}
                contentContainerStyle={styles.modal}
              >
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  textColor="#fff"
                />
                <Button
                  mode="contained"
                  onPress={() => setShowDatePicker(false)}
                  style={styles.modalButton}
                >
                  Done
                </Button>
              </Modal>
            </Portal>
          ) : (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </>
      )}

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || !weight}
        style={styles.button}
      >
        Save Weight
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  title: {
    color: '#fff',
    marginBottom: 16,
    fontWeight: '600',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#2C2C2E',
  },
  dateButton: {
    marginBottom: 16,
    borderColor: '#666',
  },
  button: {
    marginTop: 8,
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 8,
  },
  modal: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalButton: {
    marginTop: 16,
  },
}); 
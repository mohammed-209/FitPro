import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth';
import { AxiosError } from 'axios';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setErrors({
      email: emailError || '',
      password: passwordError || ''
    });

    if (!emailError && !passwordError) {
      setLoading(true);
      try {
        console.log('Starting login attempt...');
        await login(email, password);
        console.log('Login successful');
      } catch (err) {
        console.error('Login error:', err);
        // Show error in alert for debugging
        if (err instanceof AxiosError) {
          Alert.alert(
            'Login Error',
            `Status: ${err.response?.status}\nMessage: ${err.message}\nResponse: ${JSON.stringify(err.response?.data)}`
          );
          setError(err.message);
        } else if (err instanceof Error) {
          Alert.alert('Login Error', err.message);
          setError(err.message);
        } else {
          Alert.alert('Login Error', 'An unknown error occurred');
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const testConnection = async () => {
    try {
      console.log('Testing connection...');
      const response = await fetch('http://192.168.50.86:8080/test');
      const text = await response.text();
      console.log('Test response:', text);
      Alert.alert('Test Result', text);
    } catch (error) {
      console.error('Test error:', error);
      if (error instanceof Error) {
        Alert.alert('Test Error', error.message);
      } else {
        Alert.alert('Test Error', 'An unknown error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        error={!!errors.email}
        disabled={loading}
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        error={!!errors.password}
        disabled={loading}
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Button 
        mode="contained" 
        onPress={handleLogin}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Login
      </Button>
      
      <Button 
        mode="text" 
        onPress={() => router.push('/auth/signup')}
        style={styles.button}
        disabled={loading}
      >
        Don't have an account? Sign up
      </Button>

      <Button 
        mode="outlined"
        onPress={testConnection}
        style={[styles.button, styles.testButton]}
      >
        Test Connection
      </Button>

      {/* For development purposes only */}
      <Button 
        mode="outlined" 
        onPress={() => router.replace('/(app)/home')}
        style={styles.devButton}
      >
        Skip Login (Dev Mode)
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  devButton: {
    marginTop: 24,
    backgroundColor: '#f0f0f0',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  testButton: {
    marginTop: 16,
    backgroundColor: '#e0e0e0',
  },
}); 
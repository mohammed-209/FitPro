import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUp() {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', username: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const usernameError = validateUsername(username);
    
    setErrors({
      email: emailError || '',
      password: passwordError || '',
      username: usernameError || ''
    });

    if (!emailError && !passwordError && !usernameError) {
      setLoading(true);
      try {
        await signup(email, password, username);
        router.replace('/(app)/home');
      } catch (err) {
        console.error('Signup error:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred during signup');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Create Account</Text>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        error={!!errors.username}
        disabled={loading}
      />
      <HelperText type="error" visible={!!errors.username}>
        {errors.username}
      </HelperText>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
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
        mode="outlined"
        style={styles.input}
        secureTextEntry
        error={!!errors.password}
        disabled={loading}
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Button 
        mode="contained" 
        onPress={handleSignUp}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Sign Up
      </Button>
      <Button 
        mode="text" 
        onPress={() => router.push('/auth/login')}
        style={styles.button}
        disabled={loading}
      >
        Already have an account? Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  input: {
    marginVertical: 4,
    backgroundColor: '#1C1C1E',
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: '#cf6679',
    marginBottom: 12,
    textAlign: 'center',
  }
}); 
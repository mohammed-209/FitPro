import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

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
        await login(email, password);
        router.replace('/(app)/home');
      } catch (error) {
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Login</Text>
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
      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Login
      </Button>
      <Link href="/auth/signup" asChild>
        <Button mode="text" disabled={loading}>Need an account? Sign Up</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 4,
  },
  button: {
    marginTop: 16,
  },
}); 
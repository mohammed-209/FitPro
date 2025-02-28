import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useState } from 'react';
import { Link } from 'expo-router';
import { validateEmail, validatePassword, validateUsername } from '../../utils/validation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', username: '' });

  const handleSignUp = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const usernameError = validateUsername(username);
    
    setErrors({
      email: emailError || '',
      password: passwordError || '',
      username: usernameError || ''
    });

    if (!emailError && !passwordError && !usernameError) {
      // TODO: Implement signup logic
      console.log('Sign Up:', { email, password, username });
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
      />
      <HelperText type="error" visible={!!errors.password}>
        {errors.password}
      </HelperText>
      <Button mode="contained" onPress={handleSignUp} style={styles.button}>
        Sign Up
      </Button>
      <Link href="/auth/login" asChild>
        <Button mode="text">Already have an account? Login</Button>
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
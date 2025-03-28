import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Link } from 'expo-router';

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Welcome to FitPro
      </Text>
      <View style={styles.buttonContainer}>
        <Link href="/auth/login" asChild>
          <Button mode="contained">
            Login
          </Button>
        </Link>
        <Link href="/auth/signup" asChild>
          <Button mode="outlined" style={styles.signupButton}>
            Sign Up
          </Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    marginBottom: 20,
    color: '#fff',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  signupButton: {
    marginTop: 10,
  },
}); 
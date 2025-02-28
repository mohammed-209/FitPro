import { Stack } from 'expo-router';
import { Providers } from './providers';

export default function RootLayout() {
  return (
    <Providers>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1C1C1E',
          },
          headerTintColor: '#fff',
          contentStyle: {
            backgroundColor: '#121212',
          }
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="auth/login" 
          options={{ 
            title: 'Login',
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="auth/signup" 
          options={{ 
            title: 'Sign Up',
            headerShown: true
          }} 
        />
      </Stack>
    </Providers>
  );
} 
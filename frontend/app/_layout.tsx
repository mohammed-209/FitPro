import { Stack } from 'expo-router';
import Providers from './providers';

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
          name="auth" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="(app)" 
          options={{ 
            headerShown: false 
          }} 
        />
      </Stack>
    </Providers>
  );
} 
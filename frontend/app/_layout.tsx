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
          headerTitleStyle: {
            color: '#fff',
          },
          gestureEnabled: false,
          headerBackVisible: false
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }} 
        />
        <Stack.Screen 
          name="auth" 
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }} 
        />
        <Stack.Screen 
          name="(app)" 
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }} 
        />
      </Stack>
    </Providers>
  );
} 
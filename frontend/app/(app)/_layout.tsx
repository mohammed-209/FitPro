import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function AppLayout() {
  const { user, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="home" 
        options={{ 
          title: 'Home',
          headerShown: true 
        }} 
      />
      {/* Add other authenticated screens here */}
    </Stack>
  );
} 
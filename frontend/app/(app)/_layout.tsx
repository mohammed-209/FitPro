import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { IconButton } from 'react-native-paper';

export default function AppLayout() {
  const { user, loading, logout } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  // Redirect to profile setup if profile is not completed
  if (!user.profile) {
    return <Redirect href="/auth/profile-setup" />;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1C1C1E',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          color: '#fff',
        },
        headerBackVisible: true
      }}
    >
      <Stack.Screen 
        name="home" 
        options={{ 
          title: 'Home',
          headerShown: true,
          headerRight: () => (
            <IconButton
              icon="logout"
              iconColor="#fff"
              size={24}
              onPress={handleLogout}
            />
          ),
        }} 
      />
      <Stack.Screen 
        name="profile/index" 
        options={{ 
          title: 'Profile',
          headerShown: true
        }} 
      />
      {/* Add other authenticated screens here */}
    </Stack>
  );
} 
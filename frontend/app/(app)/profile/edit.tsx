import { useEffect } from 'react';
import { router } from 'expo-router';

export default function ProfileEdit() {
  useEffect(() => {
    router.replace('/auth/profile-setup?mode=edit');
  }, []);

  return null;
} 
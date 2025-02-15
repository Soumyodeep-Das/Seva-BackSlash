import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { account } from '../../lib/appwrite';
import { router } from 'expo-router';

export default function AuthLayout() {
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      await account.get();
      // If we can get the account, user is logged in, redirect to tabs
      router.replace('/(tabs)');
    } catch (error) {
      // User is not logged in, stay on auth screens
    }
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    />
  );
}
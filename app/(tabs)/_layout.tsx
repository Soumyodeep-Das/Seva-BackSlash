import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { account } from '../../lib/appwrite';
import { router } from 'expo-router';

export default function TabLayout() {
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      await account.get();
    } catch (error) {
      // If we can't get the account, user is not logged in, redirect to login
      router.replace('/(auth)/login');
    }
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4C6FFF',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointments',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="blood-banks"
        options={{
          title: 'Blood Banks',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="water-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
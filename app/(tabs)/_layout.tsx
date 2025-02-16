import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { account } from '../../lib/appwrite';
import { router } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      await account.get();
    } catch (error) {
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
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#4C6FFF',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
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
        name="search"
        options={{
          title: 'Medicine',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="search-outline" size={size} color={color} />
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
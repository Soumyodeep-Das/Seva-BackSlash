import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '../../components/Button';
import { account, databases, USERS_COLLECTION, UserProfile, defaultProfileImages } from '../../lib/appwrite';

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  async function loadUserProfile() {
    try {
      const user = await account.get();
      const profile = await databases.getDocument('default', USERS_COLLECTION, user.$id);
      setUserProfile(profile as unknown as UserProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await account.deleteSession('current');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={{ 
              uri: userProfile?.photoUrl || 
                   (userProfile?.gender === 'male' ? defaultProfileImages.male :
                    userProfile?.gender === 'female' ? defaultProfileImages.female :
                    'https://images.unsplash.com/photo-1511367461989-f85a21fda167')
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{userProfile?.name || 'User'}</Text>
          <Text style={styles.email}>{userProfile?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{userProfile?.gender || 'Not specified'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{userProfile?.age || 'Not specified'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Blood Group</Text>
              <Text style={styles.infoValue}>{userProfile?.bloodGroup || 'Not specified'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{userProfile?.weight ? `${userProfile.weight} kg` : 'Not specified'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>{userProfile?.height ? `${userProfile.height} cm` : 'Not specified'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.medicalInfo}>
              {userProfile?.additionalInfo || 'No medical conditions or allergies reported'}
            </Text>
          </View>
        </View>

        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="secondary"
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  medicalInfo: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 8,
  },
  logoutButton: {
    marginTop: 32,
  },
});
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const features = [
    {
      icon: 'videocam',
      title: 'Video Consultation',
      description: 'Connect with doctors virtually',
      route: '/video-consultation',
    },
    {
      icon: 'water',
      title: 'Blood Bank',
      description: 'Find blood donors nearby',
      route: '/blood-bank',
    },
    {
      icon: 'medical',
      title: 'Find Doctors',
      description: 'Book appointments with specialists',
      route: '/doctors',
    },
    {
      icon: 'fitness',
      title: 'Symptom Checker',
      description: 'Check your symptoms',
      route: '/symptoms',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F5F5F5' }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          Hello, User! 👋
        </Text>
        <Text style={[styles.subGreeting, { color: isDark ? '#CCCCCC' : '#666666' }]}>
          How can we help you today?
        </Text>
      </View>

      <View style={styles.emergencyButton}>
        <TouchableOpacity
          style={styles.emergencyTouchable}
          onPress={() => {/* Handle emergency */}}>
          <Ionicons name="alert-circle" size={24} color="#FFFFFF" />
          <Text style={styles.emergencyText}>Emergency Alert</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.featureCard,
              { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }
            ]}
            onPress={() => {}}>
            <Ionicons
              name={feature.icon as any}
              size={32}
              color="#007AFF"
              style={styles.featureIcon}
            />
            <Text style={[
              styles.featureTitle,
              { color: isDark ? '#FFFFFF' : '#000000' }
            ]}>
              {feature.title}
            </Text>
            <Text style={[
              styles.featureDescription,
              { color: isDark ? '#CCCCCC' : '#666666' }
            ]}>
              {feature.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subGreeting: {
    fontSize: 16,
  },
  emergencyButton: {
    margin: 20,
  },
  emergencyTouchable: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuresGrid: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
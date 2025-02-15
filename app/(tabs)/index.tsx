import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/Button';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component.'
]);


export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, User!</Text>
          <Text style={styles.subtitle}>How can we help you today?</Text>
        </View>

        <View style={styles.servicesGrid}>
          <Link href="/medicine-reminder" asChild>
            <TouchableOpacity style={styles.serviceCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae' }}
                style={styles.serviceImage}
              />
              <Text style={styles.serviceTitle}>Medicine Reminder</Text>
              <Text style={styles.serviceDescription}>
                Set reminders for your medications
              </Text>
              <View style={styles.cardFooter}>
                <Ionicons name="time-outline" size={20} color="#4C6FFF" />
                <Text style={styles.cardAction}>Set Reminders</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/bmi-calculator" asChild>
            <TouchableOpacity style={styles.serviceCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b' }}
                style={styles.serviceImage}
              />
              <Text style={styles.serviceTitle}>BMI Calculator</Text>
              <Text style={styles.serviceDescription}>
                Calculate and track your BMI
              </Text>
              <View style={styles.cardFooter}>
                <Ionicons name="calculator-outline" size={20} color="#4C6FFF" />
                <Text style={styles.cardAction}>Calculate BMI</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/blood-banks" asChild>
            <TouchableOpacity style={styles.serviceCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4' }}
                style={styles.serviceImage}
              />
              <Text style={styles.serviceTitle}>Blood Banks</Text>
              <Text style={styles.serviceDescription}>
                Find blood banks near you
              </Text>
              <View style={styles.cardFooter}>
                <Ionicons name="water-outline" size={20} color="#4C6FFF" />
                <Text style={styles.cardAction}>Find Banks</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardAction: {
    color: '#4C6FFF',
    fontWeight: '600',
  },
});
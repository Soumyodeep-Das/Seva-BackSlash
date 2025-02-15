import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, User!</Text>
          <Text style={styles.subtitle}>How can we help you today?</Text>
        </View>

        <View style={styles.servicesGrid}>
          <View style={styles.serviceCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c' }}
              style={styles.serviceImage}
            />
            <Text style={styles.serviceTitle}>Find Doctor</Text>
            <Text style={styles.serviceDescription}>
              Book appointments with qualified doctors
            </Text>
            <Button title="Book Now" style={styles.serviceButton} />
          </View>

          <View style={styles.serviceCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4' }}
              style={styles.serviceImage}
            />
            <Text style={styles.serviceTitle}>Blood Banks</Text>
            <Text style={styles.serviceDescription}>
              Find blood banks near you
            </Text>
            <Button title="Search" style={styles.serviceButton} />
          </View>

          <View style={styles.serviceCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d' }}
              style={styles.serviceImage}
            />
            <Text style={styles.serviceTitle}>Medicine</Text>
            <Text style={styles.serviceDescription}>
              Set reminders for your medications
            </Text>
            <Button title="Set Reminder" style={styles.serviceButton} />
          </View>
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
  serviceButton: {
    marginTop: 'auto',
  },
});
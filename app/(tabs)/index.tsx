import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
          {services.map((service, index) => (
            <Link key={index} href={service.link} asChild>
              <TouchableOpacity style={styles.serviceCard}>
                <Image source={{ uri: service.image }} style={styles.serviceImage} />
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <View style={styles.cardFooter}>
                  <Ionicons name={service.icon} size={20} color={service.iconColor} />
                  <Text style={styles.cardAction}>{service.action}</Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const services = [
  {
    title: 'Medicine Reminder',
    description: 'Set reminders for your medications',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
    link: '/medicine-reminder',
    icon: 'time-outline',
    iconColor: '#4C6FFF',
    action: 'Set Reminders',
  },
  {
    title: 'BMI Calculator',
    description: 'Calculate and track your BMI',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    link: '/bmi-calculator',
    icon: 'calculator-outline',
    iconColor: '#4C6FFF',
    action: 'Calculate BMI',
  },
  {
    title: 'Blood Banks',
    description: 'Find blood banks near you',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4',
    link: '/blood-banks',
    icon: 'water-outline',
    iconColor: '#4C6FFF',
    action: 'Find Banks',
  },
  {
    title: 'Cardiovascular Prediction',
    description: 'Check your cardiovascular health risk',
    image: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932',
    link: '/cardio',
    icon: 'heart-outline',
    iconColor: '#FF4C4C',
    action: 'Check Now',
  },
];

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

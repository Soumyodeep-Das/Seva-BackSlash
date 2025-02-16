import { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { account, databases, DATABASE_ID, USERS_COLLECTION, UserProfile, defaultProfileImages } from '../../lib/appwrite';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48 - 16) / 2;

export default function HomeScreen() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const user = await account.get();
      const profile = await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION,
        user.$id
      );
      setUserProfile(profile as unknown as UserProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const handleCheck = useCallback(async () => {
    if (!symptoms.trim()) {
      setResult("Please enter your symptoms.");
      return;
    }
  
    try {
      const response = await fetch("http://192.168.11.248:5000/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: symptoms }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setResult(data.result || "No diagnosis available. Please try again.");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to analyze symptoms. Please check your network and try again.");
    }
  }, [symptoms]);
  


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4C6FFF" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
            <Text style={styles.greeting}>
  Hello, {userProfile?.name?.split(' ')[0] || 'there'} 👋
</Text>

              <Text style={styles.subtitle}>How are you feeling today?</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={{
                  uri: userProfile?.photoUrl ||
                    (userProfile?.gender === 'male' ? defaultProfileImages.male :
                      userProfile?.gender === 'female' ? defaultProfileImages.female :
                        defaultProfileImages.male)
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

       {/* Quick Actions */}
<Animated.View entering={FadeInDown.delay(300).springify()}>
  <Text style={styles.sectionTitle}>Quick Actions</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActions}>
    {quickActions.map((action, index) => (
      <TouchableOpacity key={index} style={styles.quickActionItem} onPress={action.onPress || (() => {})}>
        <LinearGradient
          colors={action.colors}
          style={styles.quickActionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={action.icon} size={24} color="#FFF" />
        </LinearGradient>
        <Text style={styles.quickActionText}>{action.title}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</Animated.View>


        {/* Services Grid */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text style={styles.sectionTitle}>Health Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <Link key={index} href={service.link} asChild>
                <TouchableOpacity>
                  <Animated.View 
                    entering={FadeInRight.delay(index * 100).springify()}
                    style={styles.serviceCard}
                  >
                    <LinearGradient
                      colors={service.colors}
                      style={styles.serviceIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name={service.icon} size={24} color="#FFF" />
                    </LinearGradient>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                  </Animated.View>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </Animated.View>

        {/* Symptom Checker */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.symptomChecker}>
          <Text style={styles.sectionTitle}>Symptom Checker</Text>
          <View style={styles.symptomCheckerCard}>
            <TextInput
              style={styles.input}
              placeholder="Describe your symptoms..."
              value={symptoms}
              onChangeText={setSymptoms}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
              <Text style={styles.checkButtonText}>Analyze Symptoms</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
            {result && (
              <View style={styles.resultCard}>
                <Text style={styles.resultText}>{result}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const quickActions = [
  { title: 'Emergency', icon: 'warning-outline', colors: ['#FF6B6B', '#FF8787'] },
  { title: 'Appointment', icon: 'calendar-outline', colors: ['#4C6FFF', '#6B4CFF'] },
  { title: 'Medicine', icon: 'medical-outline', colors: ['#20C997', '#12B886'] },
  { title: 'Lab Tests', icon: 'flask-outline', colors: ['#FD7E14', '#FF922B'] },
];

const services = [
  {
    title: 'Medicine Reminder',
    description: 'Never miss your medications',
    link: '/medicine-reminder',
    icon: 'time-outline',
    colors: ['#4C6FFF', '#6B4CFF'],
  },
  {
    title: 'BMI Calculator',
    description: 'Track your body mass index today & everyday',
    link: '/bmi-calculator',
    icon: 'calculator-outline',
    colors: ['#20C997', '#12B886'],
  },
  {
    title: 'Blood Banks',
    description: 'Find blood banks nearby',
    link: '/blood-banks',
    icon: 'water-outline',
    colors: ['#FD7E14', '#FF922B'],
  },
  {
    title: 'Heart Health',
    description: 'Cardiovascular prediction',
    link: '/cardio',
    icon: 'heart-outline',
    colors: ['#FF6B6B', '#FF8787'],
  },
  {
    title: 'Diabetes Prediction',
    description: 'Check your diabetes risk',
    link: '/diabetes',
    icon: 'pulse-outline',
    colors: ['#FF9F43', '#FFB74D'],
  }
  
];

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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  profileButton: {
    width: 70,
    height: 70,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickActions: {
    marginBottom: 32,
  },
  quickActionItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  quickActionGradient: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  serviceCard: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  symptomChecker: {
    marginBottom: 32,
  },
  symptomCheckerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  checkButton: {
    backgroundColor: '#4C6FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  resultCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  resultText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});
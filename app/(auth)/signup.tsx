import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native'; // Import Text
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { account } from '../../lib/appwrite';

type SignupStep = 1 | 2 | 3;

export default function Signup() {
  const [step, setStep] = useState<SignupStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 data
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Step 2 data
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  // Step 3 data
  const [bloodGroup, setBloodGroup] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  async function handleSignup() {
    if (step !== 3) {
      setStep((prev) => (prev + 1) as SignupStep);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await account.create(
        'unique()',
        email,
        password,
        username
      );

      await account.createEmailSession(email, password);

      // Here you would typically save the additional user data to your database
      console.log('Additional user data:', {
        name,
        age,
        weight,
        height,
        bloodGroup,
        profileImage,
        additionalInfo,
      });

      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }

  function renderStep1() {
    return (
      <>
        <Input
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          icon="mail-outline"
        />

        <Input
          label="Username"
          placeholder="Choose a username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          icon="person-outline"
        />

        <Input
          label="Password"
          placeholder="Create a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          icon="lock-closed-outline"
        />
      </>
    );
  }

  function renderStep2() {
    return (
      <>
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          icon="person-outline"
        />

        <Input
          label="Age"
          placeholder="Enter your age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          icon="calendar-outline"
        />

        <Input
          label="Weight (kg)"
          placeholder="Enter your weight"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          icon="fitness-outline"
        />

        <Input
          label="Height (cm)"
          placeholder="Enter your height"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
          icon="resize-outline"
        />
      </>
    );
  }

  function renderStep3() {
    return (
      <>
        <Input
          label="Blood Group"
          placeholder="Select your blood group"
          value={bloodGroup}
          onChangeText={setBloodGroup}
          icon="water-outline"
        />

        <Button
          title={profileImage ? 'Change Profile Picture' : 'Upload Profile Picture'}
          onPress={pickImage}
          variant="secondary"
          style={styles.button}
        />

        <Input
          label="Additional Medical Information"
          placeholder="Enter any medical conditions, allergies, etc."
          multiline
          numberOfLines={4}
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          icon="medical-outline"
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Step {step} of 3</Text>
        </View>

        <View style={styles.form}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <Button
          title={step === 3 ? (loading ? 'Creating Account...' : 'Create Account') : 'Next'}
          onPress={handleSignup}
          style={styles.button}
        />

        {step > 1 && (
          <Button
            title="Back"
            onPress={() => setStep((prev) => (prev - 1) as SignupStep)}
            variant="secondary"
            style={styles.button}
          />
        )}
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
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

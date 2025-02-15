import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { createUserAccount, createUserProfile, defaultProfileImages } from '../../lib/appwrite';
import { Picker } from '@react-native-picker/picker';
import { databases } from "../appwrite"; // Import your Appwrite config


type SignupStep = 1 | 2 | 3;

export default function Signup() {
  const [step, setStep] = useState<SignupStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 data
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 data
  const [gender, setGender] = useState<'male' | 'female' | 'not-to-answer'>('not-to-answer');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  // Step 3 data
  const [bloodGroup, setBloodGroup] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');

  async function validateStep1() {
    if (!email || !password || !name || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  }

  async function handleSignup() {
    if (step !== 3) {
      if (step === 1 && !(await validateStep1())) {
        return;
      }
      setStep((prev) => (prev + 1) as SignupStep);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create user account
      const user = await createUserAccount(email, password, name);

      // Create user profile
      const photoUrl = profileImage || (gender !== 'not-to-answer' ? defaultProfileImages[gender] : undefined);

      await createUserProfile(user.$id, {
        email,
        name,
        gender,
        age,
        weight,
        height,
        bloodGroup,
        additionalInfo,
        photoUrl,
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
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
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

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          icon="lock-closed-outline"
        />
      </>
    );
  }

  function renderStep2() {
    return (
      <>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={gender}
              onValueChange={(value: 'male' | 'female' | 'not-to-answer') => setGender(value)}
            >
              <Picker.Item label="Prefer not to answer" value="not-to-answer" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>
        </View>

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

        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.previewImage} />
        )}

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
          }
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
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  button: {
    marginTop: 16,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 16,
  },
  error: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
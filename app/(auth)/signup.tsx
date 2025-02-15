import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createAccount, appwrite } from '../../lib/appwrite';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SelectList } from 'react-native-dropdown-select-list';
import * as DocumentPicker from 'expo-document-picker';
import { ID, Query } from 'appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function SignupScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    name: '',
    age: '',
    weight: '',
    height: '',
    bloodGroup: '',
    profileImage: null as string | null,
    additionalInfo: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6; // Minimum password length
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNextStep = () => {
    setError(''); // Clear any previous errors

    if (step === 1) {
      if (!validateEmail(formData.email)) {
        setError('Invalid email format.');
        return;
      }
      if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
        setError('Username must be alphanumeric.');
        return;
      }
      if (!validatePassword(formData.password)) {
        setError('Password must be at least 6 characters.');
        return;
      }
    } else if (step === 2) {
      if (!formData.name) {
        setError('Name is required.');
        return;
      }
      if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
        setError('Invalid age.');
        return;
      }
      if (!formData.weight || isNaN(Number(formData.weight))) {
        setError('Invalid weight.');
        return;
      }
      if (!formData.height || isNaN(Number(formData.height))) {
        setError('Invalid height.');
        return;
      }
    }

    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, profileImage: result.assets[0].uri });
    }
  };

  const uploadImageToAppwrite = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });

      const upload = await appwrite.storage.createFile('unique()', 'avatars', ID.unique(), file);
      return upload.$id;
    } catch (error) {
      console.error('Error uploading image: ', error);
      setError('Error uploading image. Please try again.');
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Create Account
      const user = await appwrite.account.create(ID.unique(), formData.email, formData.password, formData.name);

      // 2. Upload profile image
      let fileId = null;
      if (formData.profileImage) {
        fileId = await uploadImageToAppwrite(formData.profileImage);
        if (!fileId) {
          setLoading(false);
          return; // Exit if image upload fails
        }
      }

      // 3. Update User Document in Database
      const userDocument = await appwrite.database.createDocument(
        'seva', // Database ID
        'users', // Collection ID
        user.$id, // Document ID, using user's ID
        {
          username: formData.username,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          bloodGroup: formData.bloodGroup,
          additionalInfo: formData.additionalInfo,
          profileImage: fileId, // Store the file ID
        }
      );

      // 4. Create Session
      await appwrite.account.createEmailSession(formData.email, formData.password);

      // 5. Get Account
      const account = await appwrite.account.get();

      // Persist login state using AsyncStorage
      await AsyncStorage.setItem('isLoggedIn', 'true');

      // Redirect to dashboard
      router.replace('/(tabs)/home');

    } catch (e: any) {
      console.log('ERROR', e);
      setError(e.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={formData.username}
              onChangeText={(text) => handleInputChange('username', text)}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />

            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={formData.age}
              onChangeText={(text) => handleInputChange('age', text)}
            />

            <Text style={styles.label}>Weight (kg or lbs)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={formData.weight}
              onChangeText={(text) => handleInputChange('weight', text)}
            />

            <Text style={styles.label}>Height (cm or inches)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={formData.height}
              onChangeText={(text) => handleInputChange('height', text)}
            />
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.label}>Blood Group</Text>
            <SelectList
              setSelected={(value: any) => handleInputChange('bloodGroup', value)}
              data={BLOOD_GROUPS.map((bg) => ({ key: bg, value: bg }))}
              save="value"
              boxStyles={{ borderRadius: 5, borderColor: '#ccc' }}
              dropdownStyles={{ borderColor: '#ccc' }}
            />

            <Text style={styles.label}>Profile Image</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
            {formData.profileImage && (
              <Image source={{ uri: formData.profileImage }} style={styles.profileImagePreview} />
            )}

            <Text style={styles.label}>Additional Personal Info</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              value={formData.additionalInfo}
              onChangeText={(text) => handleInputChange('additionalInfo', text)}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={['#E0F7FA', '#B2EBF2']} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Create Account</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {renderStepContent()}

          <View style={styles.buttonContainer}>
            {step > 1 && (
              <TouchableOpacity style={styles.button} onPress={handlePrevStep}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
            )}

            {step < 3 ? (
              <TouchableOpacity style={styles.button} onPress={handleNextStep}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#00796B',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#26A69A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#B2DFDB',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#B2DFDB',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    textAlignVertical: 'top', // For Android to align text from the top
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#009688',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 100,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    alignSelf: 'center',
  },
});


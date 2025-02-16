import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const steps = ["Personal Info", "Medical History", "Lifestyle"];

type FormData = {
  BloodPressure: string;
  HeartAttack: string;
  Age: string;
  Gender: string;
  HighCholesterol: string;
  Stroke: string;
  CholesterolCheck: string;
  BMI: string;
  Smoke: string;
  Veggies: string;
  Fruits: string;
  Alcohol: string;
  Active: string;
};

const initialFormData: FormData = {
  BloodPressure: '',
  HeartAttack: '',
  Age: '',
  Gender: '',
  HighCholesterol: '',
  Stroke: '',
  CholesterolCheck: '',
  BMI: '',
  Smoke: '',
  Veggies: '',
  Fruits: '',
  Alcohol: '',
  Active: '',
};

const pageFields = {
  0: ['Age', 'Gender', 'BMI'],
  1: ['BloodPressure', 'HeartAttack', 'HighCholesterol', 'Stroke'],
  2: ['CholesterolCheck', 'Smoke', 'Veggies', 'Fruits', 'Alcohol', 'Active']
};

export default function DiabetesPrediction() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validatePage = () => {
    const currentPageFields = pageFields[page as keyof typeof pageFields];
    const emptyFields = currentPageFields.filter(field => !formData[field as keyof FormData]);
    
    if (emptyFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill all fields on this page before proceeding.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validatePage()) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setPage((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const allFields = Object.keys(formData) as Array<keyof FormData>;
    const emptyFields = allFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      Alert.alert('Missing Information', 'Please ensure all fields are filled before submitting.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_DIAB, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      Alert.alert('Error', 'Failed to predict diabetes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Diabetes Risk Assessment</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.progressContainer}>
            {steps.map((step, index) => (
              <View key={step} style={styles.stepContainer}>
                <View style={[
                  styles.stepCircle,
                  page >= index && styles.stepCircleActive
                ]}>
                  <Text style={[
                    styles.stepNumber,
                    page >= index && styles.stepNumberActive
                  ]}>{index + 1}</Text>
                </View>
                <Text style={[
                  styles.stepText,
                  page >= index && styles.stepTextActive
                ]}>{step}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>{steps[page]}</Text>
          
          {page === 0 && (
            <>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.textInput}
                value={formData.Age}
                onChangeText={(value) => handleChange('Age', value)}
                placeholder="Enter your age"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Gender</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.Gender}
                  onValueChange={(value) => handleChange('Gender', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </View>

              <Text style={styles.label}>BMI</Text>
              <TextInput
                style={styles.textInput}
                value={formData.BMI}
                onChangeText={(value) => handleChange('BMI', value)}
                placeholder="Enter your BMI"
                keyboardType="decimal-pad"
              />
            </>
          )}

          {page === 1 && (
            <>
              <Text style={styles.label}>Blood Pressure</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.BloodPressure}
                  onValueChange={(value) => handleChange('BloodPressure', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Blood Pressure Status" value="" />
                  <Picker.Item label="High" value="high" />
                  <Picker.Item label="Low" value="low" />
                </Picker>
              </View>

              <Text style={styles.label}>Previous Heart Attack</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.HeartAttack}
                  onValueChange={(value) => handleChange('HeartAttack', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Heart Attack History" value="" />
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              </View>

              <Text style={styles.label}>Cholesterol Level</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.HighCholesterol}
                  onValueChange={(value) => handleChange('HighCholesterol', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Cholesterol Level" value="" />
                  <Picker.Item label="High" value="high" />
                  <Picker.Item label="Low" value="low" />
                </Picker>
              </View>

              <Text style={styles.label}>Previous Stroke</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.Stroke}
                  onValueChange={(value) => handleChange('Stroke', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Stroke History" value="" />
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              </View>
            </>
          )}

          {page === 2 && (
            <>
              <Text style={styles.label}>Regular Cholesterol Check</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.CholesterolCheck}
                  onValueChange={(value) => handleChange('CholesterolCheck', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Cholesterol Check Frequency" value="" />
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              </View>

              <Text style={styles.label}>Smoking Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.Smoke}
                  onValueChange={(value) => handleChange('Smoke', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Smoking Status" value="" />
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              </View>

              <Text style={styles.label}>Regular Vegetable Consumption</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.Veggies}
                  onValueChange={(value) => handleChange('Veggies', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Vegetable Consumption" value="" />
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              </View>

              <Text style={styles.label}>Regular Fruit Consumption</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.Fruits}
                  onValueChange={(value) => handleChange('Fruits', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Fruit Consumption" value="" />
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              </View>

              <Text style={styles.label}>Alcohol Consumption</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.Alcohol}
                  onValueChange={(value) => handleChange('Alcohol', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Alcohol Consumption" value="" />
                  <Picker.Item label="Alcoholic" value="alcoholic" />
                  <Picker.Item label="Non Alcoholic" value="non_alcoholic" />
                </Picker>
              </View>

              <Text style={styles.label}>Physical Activity</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.Active}
                  onValueChange={(value) => handleChange('Active', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Activity Level" value="" />
                  <Picker.Item label="Active" value="yes" />
                  <Picker.Item label="Inactive" value="no" />
                </Picker>
              </View>
            </>
          )}

          <View style={styles.navigationButtons}>
            {page > 0 && (
              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]} 
                onPress={handlePrev}
              >
                <Text style={styles.buttonTextSecondary}>Previous</Text>
              </TouchableOpacity>
            )}
            {page < steps.length - 1 ? (
              <TouchableOpacity 
                style={[styles.button, styles.buttonPrimary]} 
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.button, styles.buttonPrimary, loading && styles.buttonDisabled]} 
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Analyzing...' : 'Get Results'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {result && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Ionicons name="medical" size={24} color="#4C6FFF" />
                <Text style={styles.resultTitle}>Assessment Result</Text>
              </View>
              <Text style={styles.resultText}>{result}</Text>
              <View style={styles.disclaimerContainer}>
                <Ionicons name="information-circle" size={20} color="#6B7280" />
                <Text style={styles.disclaimer}>
                  This is a preliminary assessment. Please consult with a healthcare provider for proper medical advice.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4C6FFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
    marginBottom: 20,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#4C6FFF',
  },
  stepNumber: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  stepTextActive: {
    color: '#4C6FFF',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  picker: {
    ...Platform.select({
      ios: {
        height: 150,
      },
      android: {
        height: 50,
      },
    }),
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  buttonPrimary: {
    backgroundColor: '#4C6FFF',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4C6FFF',
  },
  buttonDisabled: {
    backgroundColor: '#A5B4FC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#4C6FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  resultText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
});
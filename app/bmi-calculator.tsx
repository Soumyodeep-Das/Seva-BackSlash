import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function BMICalculatorScreen() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');

  function calculateBMI() {
    if (!weight || !height) {
      alert('Please enter both weight and height');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // Convert cm to meters
    const bmiValue = weightNum / (heightNum * heightNum);
    setBMI(bmiValue);

    // Determine BMI category
    if (bmiValue < 18.5) {
      setCategory('Underweight');
    } else if (bmiValue < 25) {
      setCategory('Normal weight');
    } else if (bmiValue < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>BMI Calculator</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Input
            label="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            placeholder="Enter your weight"
            keyboardType="numeric"
            icon="fitness-outline"
          />

          <Input
            label="Height (cm)"
            value={height}
            onChangeText={setHeight}
            placeholder="Enter your height"
            keyboardType="numeric"
            icon="resize-outline"
          />

          <Button title="Calculate BMI" onPress={calculateBMI} style={styles.calculateButton} />

          {bmi !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.bmiValue}>
                Your BMI: {bmi.toFixed(1)}
              </Text>
              <Text style={styles.category}>
                Category: {category}
              </Text>
              
              <View style={styles.scaleContainer}>
                <View style={styles.scale}>
                  <View
                    style={[
                      styles.indicator,
                      { left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%` },
                    ]}
                  />
                  <View style={styles.ranges}>
                    <Text style={styles.rangeText}>Underweight</Text>
                    <Text style={styles.rangeText}>Normal</Text>
                    <Text style={styles.rangeText}>Overweight</Text>
                    <Text style={styles.rangeText}>Obese</Text>
                  </View>
                </View>
              </View>

              <View style={styles.recommendationCard}>
                <Text style={styles.recommendationTitle}>Recommendations</Text>
                <Text style={styles.recommendationText}>
                  {category === 'Underweight' && 'Consider increasing your caloric intake and consulting with a nutritionist for a healthy weight gain plan.'}
                  {category === 'Normal weight' && 'Maintain your healthy lifestyle with a balanced diet and regular exercise.'}
                  {category === 'Overweight' && 'Focus on portion control and increasing physical activity. Consider consulting with a healthcare provider.'}
                  {category === 'Obese' && 'Please consult with a healthcare provider for a personalized weight management plan.'}
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
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
  calculateButton: {
    marginTop: 24,
  },
  resultContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  bmiValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  category: {
    fontSize: 18,
    color: '#4C6FFF',
    marginBottom: 24,
  },
  scaleContainer: {
    width: '100%',
    marginBottom: 24,
  },
  scale: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    backgroundColor: '#4C6FFF',
    borderRadius: 8,
    marginLeft: -8,
  },
  ranges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rangeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  recommendationCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
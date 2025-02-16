import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AIPredictionScreen = () => {
    const [formData, setFormData] = useState({
        Age: '', Gender: '', Height: '', Weight: '', BMI: '',
        BloodPressureCategory: '', Systolic: '', Diastolic: '',
        Smoke: '', Alcohol: '', Active: '', Glucose: '', Cholesterol: ''
    });
    const [page, setPage] = useState(1);

    const handleChange = (key, value) => {
        let newValue = value;
        if (['Age', 'Systolic', 'Diastolic'].includes(key)) {
            newValue = parseInt(value) || '';
        } else if (['Height', 'Weight', 'BMI'].includes(key)) {
            newValue = value.replace(/[^0-9.]/g, '');
        }
        setFormData({ ...formData, [key]: newValue });
    };

    const sendApiRequest = async () => {
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_CARDIO, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            Alert.alert('Prediction Result', result.prediction === 1 ? 'Cardiovascular Disease detected' : 'No Cardiovascular Disease detected');
        } catch (error) {
            Alert.alert('Error', 'Failed to get response from API.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>AI Prediction</Text>
            {page === 1 && (
                <>
                    <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" onChangeText={(value) => handleChange('Age', value)} value={formData.Age.toString()} />
                    <Picker selectedValue={formData.Gender} onValueChange={(value) => handleChange('Gender', value)} style={styles.picker}>
                        <Picker.Item label="Select Gender" value="" />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                    </Picker>
                    <TextInput style={styles.input} placeholder="Height" keyboardType="decimal-pad" onChangeText={(value) => handleChange('Height', value)} value={formData.Height} />
                    <TextInput style={styles.input} placeholder="Weight" keyboardType="decimal-pad" onChangeText={(value) => handleChange('Weight', value)} value={formData.Weight} />
                    <TouchableOpacity style={styles.button} onPress={() => setPage(2)}><Text style={styles.buttonText}>Next</Text></TouchableOpacity>
                </>
            )}
            {page === 2 && (
                <>
                    <TextInput style={styles.input} placeholder="BMI" keyboardType="decimal-pad" onChangeText={(value) => handleChange('BMI', value)} value={formData.BMI} />
                    <TextInput style={styles.input} placeholder="Systolic" keyboardType="numeric" onChangeText={(value) => handleChange('Systolic', value)} value={formData.Systolic.toString()} />
                    <TextInput style={styles.input} placeholder="Diastolic" keyboardType="numeric" onChangeText={(value) => handleChange('Diastolic', value)} value={formData.Diastolic.toString()} />
                    <Picker selectedValue={formData.BloodPressureCategory} onValueChange={(value) => handleChange('BloodPressureCategory', value)} style={styles.picker}>
                        <Picker.Item label="Select BP Category" value="" />
                        <Picker.Item label="Normal" value="normal" />
                        <Picker.Item label="Hypertension Stage 1" value="hypertension_stage_1" />
                        <Picker.Item label="Hypertension Stage 2" value="hypertension_stage_2" />
                        <Picker.Item label="Elevated" value="elevated" />
                    </Picker>
                    <TouchableOpacity style={styles.button} onPress={() => setPage(3)}><Text style={styles.buttonText}>Next</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSecondary} onPress={() => setPage(1)}><Text style={styles.buttonText}>Back</Text></TouchableOpacity>
                </>
            )}
            {page === 3 && (
                <>
                    <Picker selectedValue={formData.Cholesterol} onValueChange={(value) => handleChange('Cholesterol', value)} style={styles.picker}>
                        <Picker.Item label="Select Cholesterol" value="" />
                        <Picker.Item label="Normal" value="normal" />
                        <Picker.Item label="Above Normal" value="above_normal" />
                        <Picker.Item label="Well Above Normal" value="well_above_normal" />
                    </Picker>
                    <Picker selectedValue={formData.Glucose} onValueChange={(value) => handleChange('Glucose', value)} style={styles.picker}>
                        <Picker.Item label="Select Glucose" value="" />
                        <Picker.Item label="Normal" value="normal" />
                        <Picker.Item label="Above Normal" value="above_normal" />
                        <Picker.Item label="Well Above Normal" value="well_above_normal" />
                    </Picker>
                    <Picker selectedValue={formData.Smoke} onValueChange={(value) => handleChange('Smoke', value)} style={styles.picker}>
                        <Picker.Item label="Select Smoking Status" value="" />
                        <Picker.Item label="Smoker" value="smoker" />
                        <Picker.Item label="Non Smoker" value="non_smoker" />
                    </Picker>
                    <Picker selectedValue={formData.Alcohol} onValueChange={(value) => handleChange('Alcohol', value)} style={styles.picker}>
                        <Picker.Item label="Select Alcohol Consumption" value="" />
                        <Picker.Item label="Alcoholic" value="alcoholic" />
                        <Picker.Item label="Non Alcoholic" value="non_alcoholic" />
                    </Picker>
                    <Picker selectedValue={formData.Active} onValueChange={(value) => handleChange('Active', value)} style={styles.picker}>
                        <Picker.Item label="Select Activity Level" value="" />
                        <Picker.Item label="Active" value="active" />
                        <Picker.Item label="Inactive" value="inactive" />
                    </Picker>
                    <TouchableOpacity style={styles.button} onPress={sendApiRequest}><Text style={styles.buttonText}>Predict</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSecondary} onPress={() => setPage(2)}><Text style={styles.buttonText}>Back</Text></TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 20 },
    formContainer: { width: '100%', maxWidth: 400, backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 5 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { width: '100%', height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingHorizontal: 15, borderRadius: 10, backgroundColor: 'white' },
    picker: { width: '100%', height: 50, marginBottom: 15 },
    button: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 10 },
    buttonSecondary: { backgroundColor: '#6c757d', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default AIPredictionScreen;

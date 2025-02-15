import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AIPredictionScreen = () => {
    const [formData, setFormData] = useState({
        Age: '',
        Gender: '',
        Height: '',
        Weight: '',
        Cholesterol: '',
        BMI: '',
        BloodPressureCategory: '',
        Systolic: '',
        Diastolic: '',
        Smoke: '',
        Alcohol: '',
        Active: '',
        Glucose: ''
    });

    const [page, setPage] = useState(1);

    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const sendApiRequest = async () => {
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_CARDIO_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            Alert.alert('Prediction Result', 
                result.prediction === 1 
                ? 'Cardiovascular Disease detected' 
                : 'No Cardiovascular Disease detected'
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to get response from API.');
            console.error('API Error:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>AI Prediction</Text>
            {page === 1 && (
                <>
                    <TextInput style={styles.input} placeholder="Age" keyboardType='numeric' onChangeText={(value) => handleChange('Age', value)} value={formData.Age} />
                    <Picker selectedValue={formData.Gender} onValueChange={(value) => handleChange('Gender', value)} style={styles.picker}>
                        <Picker.Item label="Select Gender" value="" />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                    </Picker>
                    <TextInput style={styles.input} placeholder="Height" keyboardType='numeric' onChangeText={(value) => handleChange('Height', value)} value={formData.Height} />
                    <TextInput style={styles.input} placeholder="Weight" keyboardType='numeric' onChangeText={(value) => handleChange('Weight', value)} value={formData.Weight} />
                    <TouchableOpacity style={styles.button} onPress={() => setPage(2)}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </>
            )}
            {page === 2 && (
                <>
                    <Picker selectedValue={formData.Cholesterol} onValueChange={(value) => handleChange('Cholesterol', value)} style={styles.picker}>
                        <Picker.Item label="Select Cholesterol" value="" />
                        <Picker.Item label="Normal" value="normal" />
                        <Picker.Item label="Above Normal" value="above normal" />
                        <Picker.Item label="Well Above Normal" value="well above normal" />
                    </Picker>
                    <Picker selectedValue={formData.Glucose} onValueChange={(value) => handleChange('Glucose', value)} style={styles.picker}>
                        <Picker.Item label="Select Glucose" value="" />
                        <Picker.Item label="Normal" value="normal" />
                        <Picker.Item label="Above Normal" value="above normal" />
                        <Picker.Item label="Well Above Normal" value="well above normal" />
                    </Picker>
                    <TouchableOpacity style={styles.button} onPress={() => setPage(3)}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSecondary} onPress={() => setPage(1)}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </>
            )}
            {page === 3 && (
                <>
                    <Picker selectedValue={formData.Smoke} onValueChange={(value) => handleChange('Smoke', value)} style={styles.picker}>
                        <Picker.Item label="Select Smoking Status" value="" />
                        <Picker.Item label="Smoker" value="smoker" />
                        <Picker.Item label="Non Smoker" value="non smoker" />
                    </Picker>
                    <Picker selectedValue={formData.Alcohol} onValueChange={(value) => handleChange('Alcohol', value)} style={styles.picker}>
                        <Picker.Item label="Select Alcohol Consumption" value="" />
                        <Picker.Item label="Alcoholic" value="alcoholic" />
                        <Picker.Item label="Non Alcoholic" value="non alcoholic" />
                    </Picker>
                    <Picker selectedValue={formData.Active} onValueChange={(value) => handleChange('Active', value)} style={styles.picker}>
                        <Picker.Item label="Select Activity Level" value="" />
                        <Picker.Item label="Active" value="active" />
                        <Picker.Item label="Inactive" value="inactive" />
                    </Picker>
                    <TouchableOpacity style={styles.button} onPress={sendApiRequest}>
                        <Text style={styles.buttonText}>Predict</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSecondary} onPress={() => setPage(2)}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '90%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    picker: {
        width: '90%',
        height: 50,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonSecondary: {
        backgroundColor: '#6c757d',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AIPredictionScreen;

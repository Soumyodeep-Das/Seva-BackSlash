import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!symptoms.trim()) {
      Alert.alert("Error", "Please enter your symptoms.");
      return;
    }

    try {
      const response = await fetch(process.env.EXPO_PUBLIC_DEEP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: symptoms }),
      });

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch results. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Symptom Checker</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your symptoms"
        value={symptoms}
        onChangeText={setSymptoms}
        multiline
      />
      <Button title="Check" onPress={handleCheck} />
      {result && <Text style={styles.result}>{result}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    height: 100,
    textAlignVertical: "top",
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: "green",
    textAlign: "center",
  },
});

export default SymptomChecker;

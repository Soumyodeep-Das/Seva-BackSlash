import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_MED_API_KEY;

export default function MedicineSearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch() {
    if (!searchTerm) {
      setError('Please enter a medicine name');
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `https://beta.myupchar.com/api/medicine/search?api_key=${API_KEY}&name=${encodeURIComponent(searchTerm)}`
      );
      
      if (response.data.status === 'OK') {
        setSearchResults(response.data.data);
      } else {
        setError('No results found');
      }
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Medicine Search</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchBox}>
          <Input
            label="Medicine Name"
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Enter medicine name"
            icon="search-outline"
          />
          <Button title="Search" onPress={handleSearch} />
        </View>

        {loading && <ActivityIndicator size="large" color="#4C6FFF" style={styles.loader} />}
        {error && <Text style={styles.error}>{error}</Text>}

        {searchResults.map((medicine) => (
          <View key={medicine.product_id} style={styles.resultCard}>
            <Text style={styles.medicineName}>{medicine.name}</Text>
            <Text style={styles.manufacturer}>Manufacturer: {medicine.manufacturer.name}</Text>
            <Text style={styles.price}>Price: ₹{medicine.price.final_price}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  backButton: { marginRight: 16 },
  title: { fontSize: 20, fontWeight: '600', color: '#1F2937' },
  content: { flex: 1, padding: 16 },
  searchBox: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16 },
  loader: { marginVertical: 20 },
  error: { color: 'red', textAlign: 'center', marginVertical: 10 },
  resultCard: { backgroundColor: '#FFFFFF', padding: 16, marginBottom: 16, borderRadius: 12 },
  medicineName: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  manufacturer: { fontSize: 14, color: '#6B7280' },
  price: { fontSize: 16, color: '#4C6FFF' },
});
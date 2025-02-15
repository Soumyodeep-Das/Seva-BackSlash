import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import fakeBloodBanks from '../../lib/fakebloodbanks.ts';

interface BloodBank {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  pincode?: string;
  distance?: number;
}

export default function BloodBanksScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (pincode.length === 6) {
        handlePincodeSearch();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [pincode]);

  async function checkLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location access denied. Please enter your pincode.');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
      filterNearbyBloodBanks(userLocation);
    } catch {
      setError('Unable to access location. Please enter your pincode.');
    }
  }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function filterNearbyBloodBanks(userLocation: Location.LocationObject) {
    setLoading(true);
    setError(null);

    try {
      const { latitude, longitude } = userLocation.coords;
      const updatedBloodBanks = fakeBloodBanks
        .map((bank) => ({
          ...bank,
          distance: calculateDistance(latitude, longitude, bank.latitude, bank.longitude),
        }))
        .filter((bank) => bank.distance !== undefined && bank.distance <= 10)
        .sort((a, b) => (a.distance! - b.distance!));

      setBloodBanks(updatedBloodBanks);
    } catch {
      setError('Failed to process location data.');
    } finally {
      setLoading(false);
    }
  }

  function handlePincodeSearch() {
    if (pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const filteredBanks = fakeBloodBanks.filter((bank) => bank.pincode === pincode);
      if (filteredBanks.length === 0) {
        setError('No blood banks found for this pincode.');
      } else {
        setBloodBanks(filteredBanks);
      }
    } catch {
      setError('Failed to search by pincode.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="location" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Enter Pincode"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            maxLength={6}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handlePincodeSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {location && (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={
              selectedBank
                ? {
                    latitude: selectedBank.latitude,
                    longitude: selectedBank.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }
                : {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }
            }
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              pinColor="#4C6FFF"
            />
            {bloodBanks.map((bank) => (
              <Marker
                key={bank.id}
                coordinate={{ latitude: bank.latitude, longitude: bank.longitude }}
                title={bank.name}
                description={bank.address}
              />
            ))}
          </MapView>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#4C6FFF" style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView style={styles.resultsList}>
          {bloodBanks.map((bank) => (
            <TouchableOpacity key={bank.id} style={styles.bankCard} onPress={() => setSelectedBank(bank)}>
              <Text style={styles.bankName}>{bank.name}</Text>
              <Text style={styles.detailText}>{bank.address}</Text>
              <Text style={styles.detailText}>{bank.phone}</Text>
              <Text style={styles.detailText}>{bank.email}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  searchContainer: { padding: 16, backgroundColor: '#4C6FFF' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  input: { flex: 1, marginLeft: 8, fontSize: 16, color: '#1F2937' },
  searchButton: { backgroundColor: '#4C6FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  searchButtonText: { color: '#FFFFFF', fontWeight: '600' },
  mapContainer: { height: 200, marginHorizontal: 16, marginTop: 16, borderRadius: 12 },
  map: { flex: 1 },
  resultsList: { flex: 1, padding: 16 },
  bankCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16 },
  bankName: { fontSize: 18, fontWeight: '600' },
  detailText: { fontSize: 14, marginTop: 4 },
  errorText: { textAlign: 'center', color: 'red', marginTop: 20 },
});

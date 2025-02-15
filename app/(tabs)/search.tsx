import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchDrugs, DrugInfo } from '../../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DrugInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDrug, setSelectedDrug] = useState<DrugInfo | null>(null);

  async function handleSearch() {
    if (!searchQuery.trim()) {
      setError('Please enter a medicine name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchDrugs(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        setError('No medicines found');
      }
    } catch (err) {
      setError('Failed to search medicines. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4C6FFF', '#6B4CFF']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search medicines..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4C6FFF" />
          <Text style={styles.loadingText}>Searching medicines...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={styles.resultsList}>
          {searchResults.map((medicine, index) => (
            <View key={`${medicine.rxcui}-${index}`} style={styles.medicineCard}>
              <View style={styles.medicineHeader}>
                <Text style={styles.medicineName}>{medicine.synonym}</Text>
                {medicine.strength && (
                  <View style={styles.strengthBadge}>
                    <Text style={styles.strengthText}>{medicine.strength}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.detailsContainer}>
                {medicine.form && (
                  <View style={styles.detailRow}>
                    <Ionicons name="medical" size={16} color="#4C6FFF" />
                    <Text style={styles.detailText}>{medicine.form}</Text>
                  </View>
                )}
                {medicine.route && (
                  <View style={styles.detailRow}>
                    <Ionicons name="fitness" size={16} color="#4C6FFF" />
                    <Text style={styles.detailText}>{medicine.route}</Text>
                  </View>
                )}
              </View>

              {/* More Information Button */}
              <TouchableOpacity 
                style={styles.moreInfoButton} 
                onPress={() => setSelectedDrug(medicine)}
              >
                <Text style={styles.moreInfoText}>More Information</Text>
                <Ionicons name="chevron-forward" size={16} color="#4C6FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Drug Information Modal */}
      <Modal
        visible={selectedDrug !== null}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedDrug && (
              <>
                <Text style={styles.modalTitle}>{selectedDrug.synonym}</Text>
                <Text style={styles.modalDetail}><Text style={styles.bold}>Strength:</Text> {selectedDrug.strength || 'N/A'}</Text>
                <Text style={styles.modalDetail}><Text style={styles.bold}>Form:</Text> {selectedDrug.form || 'N/A'}</Text>
                <Text style={styles.modalDetail}><Text style={styles.bold}>Route:</Text> {selectedDrug.route || 'N/A'}</Text>

                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setSelectedDrug(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { padding: 20, paddingTop: 40 },
  searchContainer: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
  searchButton: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  searchButtonText: { color: '#4C6FFF', fontWeight: '600', fontSize: 16 },
  resultsList: { flex: 1, padding: 20 },
  medicineCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 15 },
  medicineHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  medicineName: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  moreInfoButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F7FF', padding: 12, borderRadius: 8 },
  moreInfoText: { color: '#4C6FFF', fontWeight: '600', marginRight: 4 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalDetail: { fontSize: 16, marginVertical: 5 },
  bold: { fontWeight: 'bold' },
  closeButton: { marginTop: 15, backgroundColor: '#4C6FFF', padding: 10, borderRadius: 5 },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { databases } from '../../lib/appwrite';  // Adjust import path
import { Query } from 'appwrite';

const SpecializationList = () => {
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const SPECIALIZATIONS_COLLECTION = process.env.EXPO_PUBLIC_YOUR_SPECIALIZATIONS_COLLECTION_ID;
  const DATABASE_ID = process.env.EXPO_PUBLIC_YOUR_DATABASE_ID;

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, SPECIALIZATIONS_COLLECTION);
        setSpecializations(response.documents);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecializations();
  }, []);

  const renderItem = ({ item }) => (
    <Link href={`/appointments/${item.$id}`} asChild>
      <TouchableOpacity style={styles.specializationCard}>
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
          style={styles.specializationImage} 
        />
        <Text style={styles.specializationName}>{item.name}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Specialization</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : specializations.length === 0 ? (
        <Text style={styles.noDataText}>No specializations available</Text>
      ) : (
        <FlatList
          data={specializations}
          renderItem={renderItem}
          keyExtractor={(item) => item.$id}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  specializationCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  specializationImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  specializationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SpecializationList;

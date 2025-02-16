import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { databases } from '../../lib/appwrite'; // Adjust import path
import { Link } from 'expo-router';
import { Query } from 'appwrite';

const DoctorList = () => {
  const { specializationId } = useLocalSearchParams();
  const [doctors, setDoctors] = useState([]);
  const DOCTORS_COLLECTION = process.env.EXPO_PUBLIC_YOUR_DOCTORS_COLLECTION_ID; // Fixed env usage
  const DATABASE_ID = process.env.EXPO_PUBLIC_YOUR_DATABASE_ID;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          DOCTORS_COLLECTION,
          [Query.equal('specializationId', specializationId)]
        );
        setDoctors(response.documents);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [specializationId]);

  const renderItem = ({ item }) => (
    <Link href={`/booking/${item.$id}`} asChild>
      <TouchableOpacity style={styles.doctorCard}>
        <Image 
          source={{ uri: item.profileImage || 'https://via.placeholder.com/150' }} 
          style={styles.doctorImage} 
        />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.doctorDegree}>{item.degree}</Text>
          <Text style={styles.doctorDetails}>{item.details}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Doctor</Text>
      <FlatList
        data={doctors}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  gridContainer: {
    paddingBottom: 16,
  },
  doctorCard: {
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
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  doctorInfo: {
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  doctorDegree: {
    fontSize: 14,
    color: '#666',
  },
  doctorDetails: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default DoctorList;

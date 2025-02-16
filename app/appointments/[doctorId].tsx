import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';  // Install this: npx expo install react-native-calendars
import { useLocalSearchParams } from 'expo-router';
import { databases, account } from '../../lib/appwrite'; // Adjust import path
import { PaymentComponent } from '../../components/PaymentComponent'; // Assuming this is where you'll handle payments
import { ID } from 'appwrite';

const AppointmentBooking = () => {
    const { doctorId } = useLocalSearchParams();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [opdType, setOpdType] = useState('online');
    const [showPayment, setShowPayment] = useState(false);
    const [userId, setUserId] = useState(null); // Store authenticated user ID

    useEffect(() => {
        // Fetch logged-in user ID
        const getUser = async () => {
            try {
                const user = await account.get();
                setUserId(user.$id);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        // Replace with actual logic to fetch doctor details and available slots
        setAvailableSlots(['10:00', '11:00', '14:00', '15:00']);
    }, [doctorId, selectedDate]);

    const handleDateSelect = (date) => {
        setSelectedDate(date.dateString);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleOpdTypeSelect = (type) => {
        setOpdType(type);
    };

    const handleBookAppointment = async () => {
        if (!selectedDate || !selectedSlot || !opdType || !userId) {
            Alert.alert('Error', 'Please select a date, time slot, OPD type, and ensure you are logged in.');
            return;
        }

        setShowPayment(true);
    };

    const handlePaymentSuccess = async (paymentDetails) => {
        try {
            const APPOINTMENTS_COLLECTION = process.env.EXPO_PUBLIC_YOUR_APPOINTMENTS_COLLECTION_ID;
            const DATABASE_ID = process.env.EXPO_PUBLIC_YOUR_DATABASE_ID;

            const appointmentData = {
                doctorId,
                patientId: userId,
                appointmentDate: selectedDate,
                appointmentSlot: selectedSlot,
                opdType,
                preBookingAmount: 100,
                paymentDetails,
                status: 'booked',
            };

            const response = await databases.createDocument(
                DATABASE_ID,
                APPOINTMENTS_COLLECTION,
                ID.unique(), // Corrected unique ID generator
                appointmentData
            );

            Alert.alert('Success', 'Appointment booked successfully!');
        } catch (error) {
            console.error('Error booking appointment:', error);
            Alert.alert('Error', 'Failed to book appointment.');
        } finally {
            setShowPayment(false);
        }
    };

    const markedDates = {
        '2025-03-01': { disabled: false, startingDay: true, color: 'green', endingDay: true },
        '2025-03-02': { disabled: false, startingDay: true, color: 'green', endingDay: true },
        '2025-03-03': { disabled: false, startingDay: true, color: 'green', endingDay: true }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Book Appointment</Text>

            <Calendar
                markedDates={markedDates}
                onDayPress={handleDateSelect}
                style={styles.calendar}
            />

            <View style={styles.opdTypeContainer}>
                <Text style={styles.label}>Select OPD Type:</Text>
                <TouchableOpacity
                    style={[styles.opdTypeButton, opdType === 'online' && styles.opdTypeButtonSelected]}
                    onPress={() => handleOpdTypeSelect('online')}
                >
                    <Text style={styles.opdTypeText}>Online</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.opdTypeButton, opdType === 'offline' && styles.opdTypeButtonSelected]}
                    onPress={() => handleOpdTypeSelect('offline')}
                >
                    <Text style={styles.opdTypeText}>Offline</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.slotsContainer}>
                <Text style={styles.label}>Available Slots:</Text>
                {availableSlots.map((slot, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.slotButton,
                            selectedSlot === slot && styles.slotButtonSelected,
                        ]}
                        onPress={() => handleSlotSelect(slot)}
                    >
                        <Text style={styles.slotText}>{slot}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
                <Text style={styles.bookButtonText}>Book Appointment - Pre-booking Amount: $100</Text>
            </TouchableOpacity>

            {showPayment && (
                <PaymentComponent onSuccess={handlePaymentSuccess} onCancel={() => setShowPayment(false)} amount={100} />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    calendar: {
        marginBottom: 20,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    opdTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 10,
    },
    opdTypeButton: {
        backgroundColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    opdTypeButtonSelected: {
        backgroundColor: '#4CAF50',
    },
    opdTypeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    slotsContainer: {
        marginBottom: 20,
    },
    slotButton: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    slotButtonSelected: {
        backgroundColor: '#4CAF50',
    },
    slotText: {
        fontSize: 16,
        color: '#333',
    },
    bookButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5,
    },
    bookButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default AppointmentBooking;

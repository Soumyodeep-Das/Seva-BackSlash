import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { MedicineReminder, getMedicineReminders, saveMedicineReminders } from '../lib/storage';

export default function MedicineReminderScreen() {
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    name: '',
    time: '',
    days: [],
    notes: '',
  });

  useEffect(() => {
    loadReminders();
  }, []);

  async function loadReminders() {
    try {
      const savedReminders = await getMedicineReminders();
      console.log('Loaded reminders:', savedReminders);
      setReminders(savedReminders || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  }

  async function handleAddReminder() {
    if (!newReminder.name || !newReminder.time) {
      Alert.alert('Validation Error', 'Please enter medicine name and time');
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(newReminder.time)) {
      Alert.alert('Invalid Time Format', 'Please enter time in HH:MM format.');
      return;
    }

    const reminder: MedicineReminder = {
      id: Date.now().toString(),
      name: newReminder.name,
      time: newReminder.time,
      days: newReminder.days || [],
      notes: newReminder.notes,
    };

    try {
      const updatedReminders = [...reminders, reminder];
      await saveMedicineReminders(updatedReminders);
      setReminders(updatedReminders);
      setShowAddForm(false);
      setNewReminder({ name: '', time: '', days: [], notes: '' });
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Medicine Reminders</Text>
      </View>

      <ScrollView style={styles.content}>
        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderCard}>
            <Text style={styles.medicineName}>{reminder.name}</Text>
            <Text style={styles.medicineTime}>{reminder.time}</Text>
            {reminder.notes && <Text style={styles.notes}>{reminder.notes}</Text>}
          </View>
        ))}
        {showAddForm ? (
          <View style={styles.addForm}>
            <Input
              label="Medicine Name"
              value={newReminder.name}
              onChangeText={(text) => setNewReminder({ ...newReminder, name: text })}
              placeholder="Enter medicine name"
              icon="medical-outline"
            />
            <Input
              label="Time"
              value={newReminder.time}
              onChangeText={(text) => setNewReminder({ ...newReminder, time: text })}
              placeholder="HH:MM"
              icon="time-outline"
            />
            <Input
              label="Notes (Optional)"
              value={newReminder.notes}
              onChangeText={(text) => setNewReminder({ ...newReminder, notes: text })}
              placeholder="Additional notes"
              icon="document-text-outline"
            />
            <Button title="Add Reminder" onPress={handleAddReminder} />
          </View>
        ) : (
          <Button title="Add New Reminder" onPress={() => setShowAddForm(true)} />
        )}
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
  reminderCard: { backgroundColor: '#FFFFFF', padding: 16, marginBottom: 16, borderRadius: 12 },
  medicineName: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  medicineTime: { fontSize: 16, color: '#4C6FFF', marginBottom: 12 },
  notes: { fontSize: 14, color: '#6B7280', fontStyle: 'italic' },
  addForm: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16 },
});

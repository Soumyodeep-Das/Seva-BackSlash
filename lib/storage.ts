import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MedicineReminder {
  id: string;
  name: string;
  time: string;
  days: string[];
  notes?: string;
}

const MEDICINE_REMINDERS_KEY = 'com.seva:medicine_reminders';

// Save medicine reminders
export async function saveMedicineReminders(reminders: MedicineReminder[]): Promise<void> {
  try {
    const serializedReminders = JSON.stringify(reminders);
    console.log('Serialized reminders before saving:', serializedReminders);
    await AsyncStorage.setItem(MEDICINE_REMINDERS_KEY, serializedReminders);
    console.log('Medicine reminders saved successfully.');
  } catch (error) {
    console.error('Error saving medicine reminders:', error);
    throw new Error('Failed to save medicine reminders.');
  }
}

// Get medicine reminders
export async function getMedicineReminders(): Promise<MedicineReminder[]> {
  try {
    const serializedReminders = await AsyncStorage.getItem(MEDICINE_REMINDERS_KEY);
    console.log('Raw data from AsyncStorage:', serializedReminders);

    if (!serializedReminders) {
      console.log('No medicine reminders found. Returning an empty array.');
      return [];
    }

    const parsedReminders = JSON.parse(serializedReminders);

    if (!Array.isArray(parsedReminders)) {
      console.warn('Data corrupted: Expected an array. Returning an empty array.');
      return [];
    }

    // Validate and filter data
    const validReminders: MedicineReminder[] = parsedReminders.filter(item => {
      const isValid =
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.time === 'string' &&
        Array.isArray(item.days) &&
        item.days.every(day => typeof day === 'string') &&
        (item.notes === undefined || typeof item.notes === 'string');

      if (!isValid) {
        console.warn('Skipping invalid reminder:', item);
      }
      return isValid;
    });

    return validReminders;
  } catch (error) {
    console.error('Error getting medicine reminders:', error);
    return [];
  }
}

// Clear all medicine reminders
export async function clearMedicineReminders(): Promise<void> {
  try {
    await AsyncStorage.removeItem(MEDICINE_REMINDERS_KEY);
    console.log('All medicine reminders cleared.');
  } catch (error) {
    console.error('Error clearing medicine reminders:', error);
  }
}

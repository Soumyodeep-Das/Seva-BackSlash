import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { MedicineReminder } from './storage';

export async function scheduleMedicineReminder(reminder: MedicineReminder) {
  if (Platform.OS === 'web') {
    console.log('Push notifications are not supported on web');
    return;
  }

  if (!reminder.time) {
    console.error("scheduleMedicineReminder: 'time' is undefined in reminder:", reminder);
    return;
  }

  const [hours, minutes] = reminder.time.split(':');
  
  // Ensure the split was successful
  if (!hours || !minutes) {
    console.error("Invalid time format:", reminder.time);
    return;
  }

  for (const day of reminder.days) {
    const trigger = {
      hour: parseInt(hours, 10),
      minute: parseInt(minutes, 10),
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medicine Reminder',
        body: `Time to take ${reminder.name}`,
        data: { reminderId: reminder.id },
      },
      trigger,
    });
  }
}


export async function cancelMedicineReminder(reminderId: string) {
  if (Platform.OS === 'web') return;

  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduledNotifications) {
    if (notification.content.data?.reminderId === reminderId) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') return;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  // Configure notification behavior
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}
import { Account, Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67b0323e00142fe00095');

export const account = new Account(client);
export const databases = new Databases(client);

// Collection IDs
export const USERS_BUCKET = 'users';
export const USERS_COLLECTION = 'users_collection';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  gender: 'male' | 'female' | 'not-to-answer';
  age?: string;
  weight?: string;
  height?: string;
  bloodGroup?: string;
  additionalInfo?: string;
  photoUrl?: string;
}

export const defaultProfileImages = {
  male: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
  female: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
};
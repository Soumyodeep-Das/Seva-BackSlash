import { Account, Client, Databases, ID } from 'appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID, APPWRITE_USERS_COLLECTION } from '@env';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// Collection & Database IDs
export const USERS_COLLECTION = APPWRITE_USERS_COLLECTION;
export const DATABASE_ID = APPWRITE_DATABASE_ID;

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

export async function createUserAccount(email: string, password: string, name: string) {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    return user;
  } catch (error: any) {
    console.error('Error creating user account:', error);
    throw error;
  }
}

export async function createUserProfile(userId: string, profileData: Partial<UserProfile>) {
  try {
    return await databases.createDocument(DATABASE_ID, USERS_COLLECTION, userId, profileData);
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

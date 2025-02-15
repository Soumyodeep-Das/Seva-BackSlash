import { Account, Client, Databases, ID } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// Collection IDs
export const USERS_COLLECTION = process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION;
export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID; // Add your database ID here

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
    // Create user account
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    // Create email session
    await account.createEmailPasswordSession(email, password);

    return user;
  } catch (error: any) { // Explicitly type 'error' as 'any'
    console.error('Error creating user account:', error);
    throw error;
  }
}

export async function createUserProfile(userId: string, profileData: Partial<UserProfile>) {
  try {
    return await databases.createDocument(
      DATABASE_ID, // Use the DATABASE_ID constant
      USERS_COLLECTION,
      userId,
      profileData
    );
  } catch (error: any) {  // Explicitly type 'error' as 'any'
    console.error('Error creating user profile:', error);
    throw error;
  }
}

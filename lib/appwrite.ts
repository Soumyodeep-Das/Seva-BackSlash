import { Account, Client, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);

export const createAccount = async (email: string, password: string, name: string) => {
  try {
    await account.create(ID.unique(), email, password, name);
    return await createSession(email, password);
  } catch (error) {
    throw error;
  }
};

export const createSession = async (email: string, password: string) => {
  try {
    return await account.createEmailSession(email, password);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};

export const deleteSession = async () => {
  try {
    return await account.deleteSession('current');
  } catch (error) {
    throw error;
  }
};
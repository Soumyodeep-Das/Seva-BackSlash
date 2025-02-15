import { Account, Client } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67b0323e00142fe00095');

export const account = new Account(client);

export { client };
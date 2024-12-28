import {addDocument, updateDocument} from '@firebase-dir/core';

export const addUser = async (username: string) => {
  try {
    return await addDocument('users', { username });
  } catch (e) {
    console.error('Error adding user:', e);
  }
};

export const updateUser = async (userId: string, time: number) => {
  try {
    await updateDocument(`users/${userId}`, {live: time});
  } catch (e) {
    console.error('Error updating user:', e);
  }
}

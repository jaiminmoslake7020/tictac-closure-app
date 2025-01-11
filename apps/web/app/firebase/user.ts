import {
  addDocument,
  getDocument,
  insertNewDocumentWithId,
  updateDocument,
} from '@firebase-dir/core';
import { User } from '@firebase/auth';

export const addUser = async (user: User) => {
  try {
    await insertNewDocumentWithId('users', user.uid, {
      uid: user.uid,
      live: new Date().getTime(),
      username: user.displayName,
      activeSession: true,
    });
    return user;
  } catch (e) {
    console.error('Error adding user:', e);
  }
};

export const updateUser = async (userId: string, time: number) => {
  try {
    await updateDocument(`users/${userId}`, {
      live: time,
      activeSession: true,
    });
    return { uid: userId, live: time };
  } catch (e) {
    console.error('Error updating user:', e);
  }
};

export const unliveUser = async (userId: string) => {
  try {
    await updateDocument(`users/${userId}`, { activeSession: false });
  } catch (e) {
    console.error('Error updating user:', e);
  }
};

export const upsertUser = async (user: User) => {
  try {
    const userExists = await getDocument(`users/${user.uid}`);
    if (userExists && userExists.exists()) {
      await updateUser(user.uid, new Date().getTime());
      return user;
    } else {
      await addUser(user);
      return user;
    }
  } catch (e) {
    console.error('Error adding user:', e);
  }
};

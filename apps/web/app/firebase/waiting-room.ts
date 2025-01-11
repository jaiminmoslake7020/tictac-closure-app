import {
  deleteDocument,
  getDocument,
  insertNewDocumentWithId,
  updateDocument,
} from '@firebase-dir/core';
import {
  FirebaseRoomType,
  UserType,
  WaitingRoomDbItemType,
} from '@types-dir/index';

export const joinWaitingRoom = async (user: UserType) => {
  try {
    await insertNewDocumentWithId('waiting-room', user.id, {
      id: user.id,
      live: new Date().getTime(),
      username: user.username,
    });
    return user;
  } catch (e) {
    console.error('Error adding user:', e);
  }
};

export const updateRoom = async (userId: string, time: number) => {
  try {
    await updateDocument(`waiting-room/${userId}`, { live: time });
    return { uid: userId, live: time };
  } catch (e) {
    console.error('Error updating user:', e);
  }
};

export const checkRoom = async (userId: string) => {
  try {
    const room = await getDocument(`waiting-room/${userId}`);
    if (room?.exists()) {
      return room?.data() as any as WaitingRoomDbItemType;
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error updating user:', e);
  }
};

export const deleteWaitingRoomUser = async (userId: string) => {
  try {
    return await deleteDocument(`waiting-room/${userId}`);
  } catch (e) {
    console.error('Error updating user:', e);
  }
  return false;
};

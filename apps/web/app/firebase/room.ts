import {
  addDocument,
  getDocument,
  listenToDocument,
  updateDocument,
} from '@firebase-dir/core';
import {
  FirebaseRoomType,
  RoomExitedResponseType,
  RoomReadyResponseType,
  UserType,
} from '@types-dir/index';
import { getCurrentTime } from '@utils/index';
import { isRoomReady } from '@utils/room';

export const getRoomData = async (
  roomCode: string
): Promise<FirebaseRoomType | null> => {
  try {
    const docSnap = await getDocument(`rooms/${roomCode}`);
    if (docSnap?.exists()) {
      return docSnap?.data() as any as FirebaseRoomType;
    } else {
      return null;
    }
  } catch (e) {
    console.error('Error getGameData:', e);
    return Promise.resolve(null);
  }
};

export const roomExists = async (roomCode: string) => {
  try {
    const docSnap = await getRoomData(roomCode);
    return docSnap !== null;
  } catch (e) {
    console.error('Error roomExists:', roomCode, e);
  }
};

export const joinRoom = async (
  roomCode: string,
  updatedDocData: any
): Promise<void> => {
  try {
    await updateDocument(`rooms/${roomCode}`, updatedDocData);
  } catch (e) {
    console.error('Error joinRoom:', roomCode, e);
  }
};

export const exitRoom = async (roomCode: string): Promise<void> => {
  try {
    await updateDocument(`rooms/${roomCode}`, {
      creator_last_visit: 0,
      joiner_last_visit: 0,
    });
  } catch (e) {
    console.error('Error joinRoom:', roomCode, e);
  }
};

export const setCreatorIsInRoom = async (roomCode: string): Promise<void> => {
  try {
    await updateDocument(`rooms/${roomCode}`, {
      creator_last_visit: getCurrentTime(),
    });
  } catch (e) {
    console.error('Error joinRoom:', roomCode, e);
  }
};

export const setJoinerIsInRoom = async (roomCode: string): Promise<void> => {
  try {
    await updateDocument(`rooms/${roomCode}`, {
      joiner_last_visit: getCurrentTime(),
    });
  } catch (e) {
    console.error('Error joinRoom:', roomCode, e);
  }
};

export const createRoom = async (
  user: UserType
): Promise<string | undefined> => {
  try {
    const roomDoc = await addDocument(`rooms`, {
      creator: user,
      creator_last_visit: getCurrentTime(),
    });
    return roomDoc?.id;
  } catch (e) {
    console.error('Error joinRoom:', e);
  }
};

export const onRoomGotReady = (
  roomCodeId: string,
  onRoomReady: (v: Partial<RoomReadyResponseType>) => Promise<void>
) => {
  const unsubscribe = listenToDocument('rooms', roomCodeId, async (d: any) => {
    isRoomReady(d);
    if (d['creator'] && d['joiner']) {
      unsubscribe();
      await onRoomReady({
        roomCode: roomCodeId,
        anotherPlayer: d.joiner,
      });
    }
  });
};

export const onRoomExit = (
  roomCodeId: string,
  onRoomReady: (v: RoomExitedResponseType) => Promise<void>
) => {
  const unsubscribe = listenToDocument('rooms', roomCodeId, async (d: any) => {
    if (d['exited']) {
      unsubscribe();
      await onRoomReady({
        exitedBy: d['exited'],
      });
    }
  });
};

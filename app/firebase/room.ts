import {addDocument, getDocument, listenToDocument, updateDocument} from '@firebase-dir/core';
import {RoomExitedResponseType, RoomReadyResponseType, UserType} from '@types-dir/index';

export const getRoomData = async (roomCode: string) => {
  try {
    return await getDocument(`rooms/${roomCode}`);
  } catch (e) {
    console.error('Error getRoomData:', e);
  }
}

export const roomExists = async (roomCode: string) => {
  try {
    const docSnap = await getRoomData(roomCode);
    return docSnap?.exists();
  } catch (e) {
    console.error('Error roomExists:', roomCode, e);
  }
}

export const joinRoom = async (roomCode: string, updatedDocData: any): Promise<void> => {
  try {
    await updateDocument(`rooms/${roomCode}`, updatedDocData);
  } catch (e) {
    console.error('Error joinRoom:', roomCode, e);
  }
}

export const exitRoom = async (roomCode: string, userId: string): Promise<void> => {
  try {
    await updateDocument(`rooms/${roomCode}`, {exited: userId});
  } catch (e) {
    console.error('Error joinRoom:', roomCode, e);
  }
}

export const createRoom = async (user: UserType): Promise<string | undefined> => {
  try {
    const roomDoc = await addDocument(`rooms`, {
      creator: user
    });
    return roomDoc?.id
  } catch (e) {
    console.error('Error joinRoom:', e);
  }
}


export const onRoomGotReady = (roomCodeId: string, onRoomReady: (v: Partial<RoomReadyResponseType>) => Promise<void> ) => {
  const unsubscribe = listenToDocument('rooms', roomCodeId, async (d: any) => {
    if (d['creator'] && d['joiner'] && !d['exited']) {
      unsubscribe();
      // console.log('unsubscribed', d);
      await onRoomReady({
        roomCode: roomCodeId,
        anotherPlayer: d.joiner
      });
    } else {
      // console.log('d is not ready', d);
    }
  });
}

export const onRoomExit = (roomCodeId: string, onRoomReady: (v: RoomExitedResponseType) => Promise<void> ) => {
  const unsubscribe = listenToDocument('rooms', roomCodeId, async (d: any) => {
    if (d['exited']) {
      unsubscribe();
      // console.log('unsubscribed', d);
      await onRoomReady({
        exitedBy: d['exited']
      });
    } else {
      // console.log('d is not ready', d);
    }
  });
}

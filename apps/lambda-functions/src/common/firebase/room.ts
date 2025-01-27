import { UserType } from '../types';
import {addDocument, updateDocument} from './core';
import { getCurrentTime } from '../utils';

export const createRoom = async (
  roomCreator: UserType,
  roomJoiner: UserType,
): Promise<string | undefined> => {
  try {
    // adding creator_last_visit and joiner_last_visit to the room which is future 30 seconds from now
    // it allows clients to join the room and set up the game
    const roomDoc = await addDocument(`rooms`, {
      creator: roomCreator,
      creator_last_visit: getCurrentTime() + 30000,
      joiner: roomJoiner,
      joiner_last_visit: getCurrentTime() + 30000,
    });
    return roomDoc?.id;
  } catch (e) {
    console.error('Error joinRoom:', e);
  }
};

export const updateRoom = async ( roomId: string, roomData: any) => {
    try {
        await updateDocument(`rooms/${roomId}`, roomData);
    } catch (e) {
        console.error('Error updating room:', e);
    }
}

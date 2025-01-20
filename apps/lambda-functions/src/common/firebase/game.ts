import { FirebaseGameTypeDocumentReference, UserType } from '../types';
import { getRandomMove } from '../utils';
import { addDocument } from './core';

export const createGame = async (
  roomCode: string,
  currentMove: string,
  userId: string,
): Promise<FirebaseGameTypeDocumentReference | undefined> => {
  try {
    return await addDocument(`rooms/${roomCode}/games`, {
      currentMove: currentMove,
      time: new Date().getTime(),
      creator: userId,
    });
  } catch (e) {
    console.error('Error startGame', e);
  }
};

export const createGameForRoomJoiner = async (
  roomCode: string,
  roomCreator: UserType,
  roomJoiner: UserType,
): Promise<string | undefined> => {
  const currentMove = getRandomMove(roomCreator, roomJoiner);
  const gameDoc = await createGame(roomCode, currentMove, roomJoiner.id);
  if (gameDoc) {
    return gameDoc.id;
  }
  console.error('Error creating game for room joiner');
  return undefined;
};

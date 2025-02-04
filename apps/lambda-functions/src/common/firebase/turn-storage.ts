import { fetchAllDocuments, insertNewDocumentWithId } from './core';
import { MovePositionType } from '../types';

export const getTurnStoragePath = (roomId: string, gameId: string): string =>
  `rooms/${roomId}/games/${gameId}/turnStorage`;

export const getTurnStorageData = async (roomCode: string, gameId: string) => {
  const turnStoragePath = getTurnStoragePath(roomCode, gameId);
  try {
    return await fetchAllDocuments(turnStoragePath);
  } catch (e) {
    console.error('Error getTurnStorage', e);
    return undefined;
  }
};

export const addNewTurnFirebase = async (
  roomCode: string,
  gameId: string,
  userId: string,
  position: MovePositionType,
  numberOfTurnsMade: number,
) => {
  try {
    const turnStorageCollectionPath = getTurnStoragePath(roomCode, gameId);
    return await insertNewDocumentWithId(
      turnStorageCollectionPath,
      String(position),
      {
        userId,
        position,
        numberOfTurnsMade,
      },
    );
  } catch (e) {
    console.error('Error addNewTurnFirebase: ', e);
  }
};

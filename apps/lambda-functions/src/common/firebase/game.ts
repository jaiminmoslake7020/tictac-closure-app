import {FirebaseGameType, FirebaseGameTypeDocumentReference, UserType} from '../types';
import { getRandomMove } from '../utils';
import {addDocument, getDocument, updateDocument} from './core';

export const getGamePath = (roomId: string, gameId: string) : string => `rooms/${roomId}/games/${gameId}`;

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


export const getGameData = async (roomId: string, gameId: string) :Promise<undefined | FirebaseGameType> => {
  try {
    const data = await getDocument(getGamePath(roomId, gameId));
    return data && data.exists ? data.data() : undefined;
  } catch (e) {
    console.error('Error updating room:', e);
    return undefined;
  }
}

export const updateChatGptConversation = async ( roomId: string, gameId:string, conversation: any) => {
  try {
    await updateDocument(getGamePath(roomId, gameId), {
      chatGptConversation: conversation
    });
  } catch (e) {
    console.error('Error updating room:', e);
  }
}

export const retrieveCurrentChatGptConversation = async ( roomId: string, gameId:string) => {
  try {
    const gameData = await getGameData(roomId, gameId);
    if (gameData) {
      return gameData.chatGptConversation
    }
    return undefined;
  } catch (e) {
    console.error('Error retrieveCurrentChatGptConversation:', e);
    return undefined;
  }
}

export const validateGame = async (roomId: string, gameId: string) : Promise<boolean> => {
  try {
    return Boolean(await getGameData(roomId, gameId));
  } catch (e) {
    console.error('Error retrieveCurrentChatGptConversation:', e);
    return false;
  }
}

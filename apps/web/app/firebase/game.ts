import {
  addDocument,
  fetchAllDocuments,
  getDocument,
  insertNewDocumentWithId,
  lambdaChatgptApiUrl,
  listenToCollectionV2,
  updateDocument,
} from '@firebase-dir/core';
import {
  FirebaseGameType,
  FirebaseGameTypeDocumentReference,
  FirebaseTurnStorageType,
  GamePlayerType,
  MovePositionType,
} from '@types-dir/index';
import { QueryDocumentSnapshot } from '@firebase/firestore';

export const updateGameWithCurrentMove = async (
  gamePath: string,
  currentMove: string
) => {
  try {
    await updateDocument(gamePath, { currentMove });
  } catch (e) {
    console.error('Error updateGameWithCurrentMove', e);
  }
};

export const addNewTurnFirebase = async (
  turnStorageCollectionPath: string,
  userId: string,
  position: MovePositionType,
  numberOfTurnsMade: number
) => {
  try {
    return await insertNewDocumentWithId(
      turnStorageCollectionPath,
      String(position),
      {
        userId,
        position,
        numberOfTurnsMade,
      }
    );
  } catch (e) {
    console.error('Error addNewTurnFirebase: ', e);
  }
};

export const createGame = async (
  roomCode: string,
  currentMove: string,
  userId: string
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

export const updateLastActive = async (
  gamePath: string,
  playerType: GamePlayerType
): Promise<void> => {
  try {
    await updateDocument(gamePath, {
      [playerType.toLowerCase() + '_last_active_time']: new Date().getTime(),
    });
  } catch (e) {
    console.error('Error startGame', e);
  }
};

export const getGame = async (
  gamePath: string
): Promise<FirebaseGameType | undefined> => {
  try {
    const gameDocument = await getDocument(gamePath);
    if (gameDocument && gameDocument.exists()) {
      return gameDocument.data() as FirebaseGameType;
    }
    return undefined;
  } catch (e) {
    console.error('Error startGame', e);
  }
};

export const getAllGameMoves = async (
  gamePath: string
): Promise<FirebaseTurnStorageType[] | undefined> => {
  try {
    const gameDocuments = await fetchAllDocuments(gamePath + '/turnStorage');
    if (gameDocuments && Array.isArray(gameDocuments)) {
      return gameDocuments as FirebaseTurnStorageType[];
    }
    return undefined;
  } catch (e) {
    console.error('Error startGame', e);
  }
};

export const setWinner = async (gamePath: string, winner: string) => {
  try {
    await updateDocument(gamePath, { game_completed: true, winner });
  } catch (e) {
    console.error('Error startGame', e);
  }
};

export const setGameCompletedWithoutWinner = async (gamePath: string) => {
  try {
    await updateDocument(gamePath, { game_completed: true, no_winner: true });
  } catch (e) {
    console.error('Error startGame', e);
  }
};

export const onGameCreated = (
  roomCode: string,
  onGameReady: (d: FirebaseGameType, id: string) => void,
  onFinished: () => void
) => {
  let start = 0;
  let didNotFound = true;
  listenToCollectionV2(
    `rooms/${roomCode}/games`,
    (d: QueryDocumentSnapshot<FirebaseGameType>, l: number) => {
      const time = d.data().time;

      if (time && new Date().getTime() - time < 10000) {
        onGameReady(d.data(), d.id);
        didNotFound = false;
      }
      if (start === l - 1) {
        if (didNotFound) {
          onFinished();
        }
      }
      start++;
    },
    onFinished
  );
};

export const chatGptRequest = async (roomId: string, gameId: string) => {
  try {
    const response = await fetch(
      lambdaChatgptApiUrl + '/default/give-your-move?roomCode=' + roomId + '&gameId=' + gameId
    );
    const json = await response.json();
    return json.body;
  } catch (e) {
    console.error('Error informChatGptToJoinGame: ', e);
    return Promise.resolve({
      chatGptMove: 'ERROR',
    });
  }
};

export const askChatGptForItsMove = async (roomId: string, gameId: string) => {
  return await chatGptRequest(roomId, gameId);
};

export const askChatGptToJoinGame = async (roomId: string, gameId: string) => {
  return await chatGptRequest(roomId, gameId);
};

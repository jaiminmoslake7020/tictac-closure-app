import {
  addDocument,
  insertNewDocumentWithId,
  listenToCollectionV2,
  updateDocument
} from '@firebase-dir/core';
import {FirebaseGameType, FirebaseGameTypeDocumentReference, MovePositionType} from '@types-dir/index';
import {QueryDocumentSnapshot} from '@firebase/firestore';

export const updateGameWithCurrentMove = async (gamePath: string, currentMove: string) => {
  try {
    await updateDocument(gamePath, {currentMove});
  } catch (e) {
    console.log('Error updateGameWithCurrentMove', e);
  }
};

export const addNewTurnFirebase = async (turnStorageCollectionPath: string, userId: string, position: MovePositionType) => {
  try {
    return await insertNewDocumentWithId(turnStorageCollectionPath, String(position), {userId, position});
  } catch (e) {
    console.log('Error addNewTurnFirebase: ', e);
  }
};

export const createGame = async (roomCode: string, currentMove: string, userId: string) : Promise<FirebaseGameTypeDocumentReference | undefined> => {
  try {
   return await addDocument(`rooms/${roomCode}/games`, {currentMove: currentMove, time: (new Date()).getTime(), creator: userId});
  } catch (e) {
    console.log('Error startGame', e);
  }
}

export const setWinner = async (gamePath: string, winner: string) => {
  try {
    await updateDocument(gamePath, {winner});
  } catch (e) {
    console.log('Error startGame', e);
  }
}

export const onGameCreated = (roomCode: string, onGameReady: (d:FirebaseGameType, id: string) => void, onFinished: () => void) => {
  let start = 0 ;
  let didNotFound = true;
  const unsubscribe = listenToCollectionV2(`rooms/${roomCode}/games`, (d: QueryDocumentSnapshot<FirebaseGameType>, l: number) => {
    // console.log('onGameCreated', d.data(), d.id);
    const time = d.data().time;

    if (time && (new Date()).getTime() - time < 10000) {
      console.log('onGameCreated Time Diff',  (new Date()).getTime() - time );
      // unsubscribe();
      onGameReady(d.data(), d.id);
      didNotFound = false;
    }
    if (start === l - 1) {
      // unsubscribe();
      if (didNotFound) {
        console.log("last row", start, l);
        onFinished();
      }
    }
    start++;
  }, onFinished);
}



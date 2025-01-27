import {
  getTurnStorageCollectionPath,
  InitializeContextsFunctionType,
} from '@contexts/index';
import { listenToCollection } from '@firebase-dir/index';

export const RemoteFriendPlayer = (
  contextsData: InitializeContextsFunctionType,
  addNewMove: (d: any) => void
) => {
  const collectionName = getTurnStorageCollectionPath(contextsData);
  const unsubscribe = listenToCollection(
    collectionName,
    (d: any, changes: number) => {
      // CheckWinner( contextsData );
      if (changes === 9) {
        // console.log('no more moves', 1);
        unsubscribe();
      }
      addNewMove(d);
    }
  );
};

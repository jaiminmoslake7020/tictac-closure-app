import {InitializeContextsFunctionType, useContextRoomCodeId} from '@contexts/index';
import {listenToCollection } from '@firebase-dir/index';

export const RemoteFriendPlayer = (contextsData:InitializeContextsFunctionType, addNewMove: (d:any) => void) => {
  const { getRoomCodeId } = useContextRoomCodeId( contextsData );
  const roomCodeId = getRoomCodeId();
  const unsubscribe = listenToCollection(`rooms/${roomCodeId}/turnStorage`, (d: any, changes: number) => {
    // CheckWinner( contextsData );
    if ( changes === 9 ) {
      // console.log('no more moves', 1);
      unsubscribe();
    }
    addNewMove(d);
  });
}

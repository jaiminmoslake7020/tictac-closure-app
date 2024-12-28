import {
  MovePositionType, TurnHandlerType, TurnType, WinnerType,
} from '@types-dir/index';
import { CheckWinner } from './CheckWinner';
import {
  getGameDocumentPath,
  InitializeContextsFunctionType, useContextAnotherPlayer, useContextCurrentMove, useContextGameId,
  useContextOpponentType, useContextRoomCodeId,
  useContextTurnHookType,
  useContextTurnStorage, useContextUserSession
} from '@contexts/index';
import {ComputerProgramMove} from './ComputerProgram/ComputerProgramMove';
import {RemoteFriendPlayer} from './RemoteFriendPlayer/RemoteFriendPlayer';
import {
  addNewTurnFirebase, setWinner as setWinnerFirebase,
  updateGameWithCurrentMove
} from '@firebase-dir/index';
import {UseCurrentMoveHookType} from '@contexts/index';
import {turnData} from '@data/index';

export const setWinnerAtFirebase = (contextsData: InitializeContextsFunctionType, foundWinner: WinnerType) => {
  const { getUser } = useContextUserSession( contextsData );
  const { getAnotherPlayer } = useContextAnotherPlayer( contextsData );
  const gameDocumentPath = getGameDocumentPath( contextsData );
  const { removeGameId } = useContextGameId(contextsData);
  if ( foundWinner === turnData.turn ) {
    setWinnerFirebase( gameDocumentPath, getUser().username ).then(r => console.log('set-winner-at-firebase'));
  } else {
    setWinnerFirebase( gameDocumentPath, getAnotherPlayer().username ).then(r => console.log('set-winner-at-firebase'));
  }
  setTimeout(() => {
    removeGameId();
  }, 3000);
}

export const TurnHandler = ( contextsData: InitializeContextsFunctionType, anotherPersonMadeMove: ( v: MovePositionType ) => Promise<void> ) : TurnHandlerType => {

  const { setCurrentMove } = useContextCurrentMove(contextsData) as UseCurrentMoveHookType;

  const {
    getOpponentType
  } = useContextOpponentType(contextsData);

  const {
    getRoomCodeId
  } = useContextRoomCodeId(contextsData);

  const {
    getUser
  } = useContextUserSession(contextsData);

  const {
    getAnotherPlayer
  } = useContextAnotherPlayer(contextsData);

  const {
    getTurn, changeTurn
  } = useContextTurnHookType(contextsData);


  const opponentType = getOpponentType();

  const {
    addNewTurn
  } = useContextTurnStorage(contextsData);

  const changeTurnOfTurnHandler = async (v :  MovePositionType) => {
    if (opponentType === 'remote-friend-player') {
      const gameDocumentPath = getGameDocumentPath(contextsData);
      const turnStorageCollectionPath = `${gameDocumentPath}/turnStorage`;
      await addNewTurnFirebase(turnStorageCollectionPath, getUser().id as string, v);
      await updateGameWithCurrentMove(gameDocumentPath , getAnotherPlayer().id );
      addNewTurn(v, getTurn() as TurnType);
      setCurrentMove( getAnotherPlayer().id );
    } else {
      addNewTurn(v, getTurn() as TurnType);
    }
    afterChangeTurn();
  }

  const afterChangeTurn = () => {
    if (opponentType === 'remote-friend-player') {
      CheckWinner(contextsData, setWinnerAtFirebase);
    } else {
      CheckWinner(contextsData);
    }
    anotherPersonChangeTurn();
  }

  const anotherPersonChangeTurn = () => {
    if ( opponentType === "same-device-play" ) {
      changeTurn();
    } else if (opponentType === 'computer-program') {
      ComputerProgramMove(contextsData);
    } else if (opponentType === 'remote-friend-player') {
      changeTurn();
    }
  }

  const printData = () => {
    // console.log('turnStorage');
  }

  if (
    opponentType === 'remote-friend-player'
  ) {
    RemoteFriendPlayer( contextsData , async (doc: any) => {
      const {
        userId, position
      } = doc;
      if (
        userId !== getUser().id
      ) {
        //other person made move
        if (getTurn() === turnData.turn) {
          changeTurn();
        }
        addNewTurn(position, getTurn() as TurnType);
        CheckWinner(contextsData, setWinnerAtFirebase);

        // now make it change who will have move
        setCurrentMove( getUser().id );
        changeTurn();
        await anotherPersonMadeMove( position );
      }
    });
  }

  return {
    turn: getTurn(), changeTurn: changeTurnOfTurnHandler, getTurn, printData,
  }
}

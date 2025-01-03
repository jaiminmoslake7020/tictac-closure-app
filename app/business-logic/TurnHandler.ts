import {
  MovePositionType, TurnHandlerType, TurnType, WinnerType,
} from '@types-dir/index';
import { CheckWinner } from './CheckWinner';
import {
  checkGameCompleted, getAllCurrentTurns,
  getGameDocumentPath,
  InitializeContextsFunctionType,
  useContextAnotherPlayer,
  useContextCurrentMove,
  useContextGameId,
  useContextOpponentType,
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
import {setGameCompletedWithoutWinner} from '@firebase-dir/game';

export const setWinnerAtFirebase = (contextsData: InitializeContextsFunctionType, foundWinner: WinnerType) => {
  const { getUser } = useContextUserSession( contextsData );
  const { getAnotherPlayer } = useContextAnotherPlayer( contextsData );
  const gameDocumentPath = getGameDocumentPath( contextsData );
  const { removeGameId } = useContextGameId(contextsData);
  if (gameDocumentPath) {
    if ( foundWinner === turnData.turn ) {
      setWinnerFirebase( gameDocumentPath, getUser().username ).then(r => console.log('set-winner-at-firebase'));
    } else {
      setWinnerFirebase( gameDocumentPath, getAnotherPlayer().username ).then(r => console.log('set-winner-at-firebase'));
    }
  } else {
    console.error('gameDocumentPath is not available');
  }
  setTimeout(() => {
    removeGameId();
  }, 3000);
}

export const setGameCompletedAtFirebase = (contextsData: InitializeContextsFunctionType) => {
  const gameDocumentPath = getGameDocumentPath( contextsData );
  const { removeGameId } = useContextGameId(contextsData);
  if (gameDocumentPath) {
    setGameCompletedWithoutWinner( gameDocumentPath ).then(r => console.log('set-game-completed-at-firebase'));
  } else {
    console.error('gameDocumentPath is not available');
  }
  setTimeout(() => {
    removeGameId();
  }, 3000);
}

export const checkGameCompletedInner = (contextsData: InitializeContextsFunctionType) => {
  const isCompleted = checkGameCompleted(contextsData);
  if (isCompleted) {
    setGameCompletedAtFirebase(contextsData);
    return true;
  }
  return false;
}

export const TurnHandler = ( contextsData: InitializeContextsFunctionType, anotherPersonMadeMove: ( v: MovePositionType ) => Promise<void>) : TurnHandlerType => {

  const { setCurrentMove } = useContextCurrentMove(contextsData) as UseCurrentMoveHookType;

  const {
    getOpponentType
  } = useContextOpponentType(contextsData);

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
      if (gameDocumentPath) {
        await updateGameWithCurrentMove(gameDocumentPath , getAnotherPlayer().id );
      } else {
        console.error('gameDocumentPath is not available');
      }
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
      checkGameCompletedInner(contextsData);
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
        !getAllCurrentTurns(contextsData).includes(position)
      ) {
        if (
          userId !== getUser().id
        ) {
          //other person made move
          if (getTurn() === turnData.turn) {
            changeTurn();
          }
          addNewTurn(position, getTurn() as TurnType);
          CheckWinner(contextsData, setWinnerAtFirebase);
          checkGameCompletedInner(contextsData);

          // now make it change who will have move
          setCurrentMove( getUser().id );
          changeTurn();
          await anotherPersonMadeMove( position );
        }
      } else {
        // console.log('position is already taken', position, userId);
      }
    });
  }

  return {
    turn: getTurn(), changeTurn: changeTurnOfTurnHandler, getTurn, printData,
  }
}

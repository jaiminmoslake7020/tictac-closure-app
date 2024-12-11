import {
  MovePositionType, TurnHandlerType, TurnType,
} from '../types';
import { CheckWinner } from './CheckWinner';
import {
  InitializeContextsFunctionType, useContextAnotherPlayer, useContextCurrentMove,
  useContextGameType, useContextRoomCodeId,
  useContextTurnHookType,
  useContextTurnStorage, useContextUserSession
} from '../contexts';
import {ComputerProgramMove} from './ComputerProgram/ComputerProgramMove';
import {RemoteFriendPlayer} from './RemoteFriendPlayer/RemoteFriendPlayer';
import {insertNewDocument, updateDocument} from '../firebase';
import {CurrentMoveHookType} from '../contexts/useCurrentMove';
import {turnData} from '../data';

export const TurnHandler = ( contextsData: InitializeContextsFunctionType, anotherPersonMadeMove: ( v: MovePositionType ) => Promise<void> ) : TurnHandlerType => {

  const { getCurrentMove, setCurrentMove } = useContextCurrentMove(contextsData) as CurrentMoveHookType;

  const {
    getGameType
  } = useContextGameType(contextsData);

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

  const gameType = getGameType();

  const {
    addNewTurn
  } = useContextTurnStorage(contextsData);

  const changeTurnOfTurnHandler = async (v :  MovePositionType) => {
    if (gameType === 'remote-friend-player') {
      const roomCodeId = getRoomCodeId();
      await insertNewDocument( roomCodeId, getUser().id as string, v);
      await updateDocument( roomCodeId , getAnotherPlayer().id );
      addNewTurn(v, getTurn() as TurnType);
      setCurrentMove( getAnotherPlayer().id );
    } else {
      addNewTurn(v, getTurn() as TurnType);
    }
    afterChangeTurn();
  }

  const afterChangeTurn = () => {
    CheckWinner(contextsData);
    anotherPersonChangeTurn();
  }

  const anotherPersonChangeTurn = () => {
    if ( gameType === "same-device-play" ) {
      changeTurn();
    } else if (gameType === 'computer-program') {
      ComputerProgramMove(contextsData);
    } else if (gameType === 'remote-friend-player') {
      changeTurn();
    }
  }

  const printData = () => {
    console.log('turnStorage');
  }

  if (
    gameType === 'remote-friend-player'
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
        CheckWinner(contextsData);

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

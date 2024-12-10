import {
  MovePositionType, TurnHandlerType, TurnType,
} from '../types';
import { CheckWinner } from './CheckWinner';
import {
  InitializeContextsFunctionType,
  useContextGameType,
  useContextTurnHookType,
  useContextTurnStorage
} from '../contexts';
import {ComputerProgramMove} from './ComputerProgram/ComputerProgramMove';

export const TurnHandler = ( contextsData: InitializeContextsFunctionType ) : TurnHandlerType => {

  const {
    getGameType
  } = useContextGameType(contextsData);

  const {
    getTurn, changeTurn: changeTurnFnHook
  } = useContextTurnHookType(contextsData);

  const gameType = getGameType();

  const {
    addNewTurn
  } = useContextTurnStorage(contextsData);

  const changeTurn = (v :  MovePositionType) => {
    addNewTurn(v, getTurn() as TurnType);
    afterChangeTurn();
  }

  const afterChangeTurn = () => {
    CheckWinner(contextsData);
    anotherPersonChangeTurn();
  }

  const anotherPersonChangeTurn = () => {
    if ( gameType === "same-device-play" ) {
      changeTurnFnHook();
    } else if (gameType === 'computer-program') {
      ComputerProgramMove(contextsData);
    } else if (gameType === 'remote-friend-player') {
      // ComputerProgramMove(contextsData);
    }
  }

  const printData = () => {
    console.log('turnStorage');
  }

  return {
    turn: getTurn(), changeTurn, getTurn, printData
  }
}

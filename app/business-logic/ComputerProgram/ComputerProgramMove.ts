import {appLevelList} from '../../helpers';
import {FindAnotherEasy} from './FindAnotherEasy';
import {FindAnotherMedium} from './FindAnotherMedium';
import {FindAnotherHard} from './FindAnotherHard';
import {CheckWinner} from '../CheckWinner';
import {
  InitializeContextsFunctionType,
  useContextAppLevelType,
  useContextTurnStorage,
  useContextWinner
} from '../../contexts';
import {turnData} from '../../data';

export const ComputerProgramMove = (
  contextsData : InitializeContextsFunctionType
) => {
  const { anotherTurn } = turnData;
  const {
    getAppLevelType
  } = useContextAppLevelType(contextsData);
  const { getWinner } = useContextWinner( contextsData );
  const { addNewTurn } = useContextTurnStorage( contextsData );
  const appLevel = getAppLevelType();
  if ( getWinner() === null ) {
    let nextMove;
    if ( appLevel === appLevelList.easy ) {
      nextMove = FindAnotherEasy(contextsData);
    } else if (
      appLevel === appLevelList.medium
    ) {
      nextMove = FindAnotherMedium(contextsData);
    } else {
      nextMove = FindAnotherHard(contextsData);
    }
    if (nextMove) {
      addNewTurn(nextMove, anotherTurn);
    }
    CheckWinner(contextsData);
  }
}

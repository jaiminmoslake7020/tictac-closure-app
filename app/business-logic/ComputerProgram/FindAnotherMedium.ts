import {MovePositionType, MovePositionTypeWithNull, TurnType, WinnerType} from '../../types';
import {turnData, winnerData} from '../../data';
import { WhenOneInSequence } from './WhenOneInSequence';
import { FindAnotherEasy } from './FindAnotherEasy';
import {
  InitializeContextsFunctionType,
  useContextTurnStorage,
  useContextWinner,
  useContextWinnerSeq
} from '../../contexts';

export const FindAnotherMedium = (
  contextsData: InitializeContextsFunctionType,
) : MovePositionType => {

  const {turn, anotherTurn} = turnData;
  const { getTurnStorage } = useContextTurnStorage( contextsData );
  const { setWinnerSequence } = useContextWinnerSeq( contextsData );
  const { setWinner } = useContextWinner( contextsData );
  const turnStorage = getTurnStorage();

  let foundWinner = null as WinnerType;
  let foundAnotherMove = null as MovePositionTypeWithNull;

  const currentValues = turnStorage[ turn ];
  const anotherCurrentValues = turnStorage[ anotherTurn ] || [];
  if (currentValues.length > 1) {
    let startAt = 0 ;
    while (startAt < winnerData.length) {
      const seq = winnerData[startAt];
      if (
        !( currentValues.includes( seq[0] ) && currentValues.includes( seq[1] ) && currentValues.includes( seq[2] ) )
      ) {
        if (foundAnotherMove === null) {
          if (
            ( currentValues.includes( seq[0] ) && currentValues.includes( seq[1] ) && !anotherCurrentValues.includes( seq[2] ) )
          ) {
            foundAnotherMove = seq[2];
          } else  if (
            ( currentValues.includes( seq[1] ) && currentValues.includes( seq[2] ) && !anotherCurrentValues.includes( seq[0] ) )
          ) {
            foundAnotherMove = seq[0];
          } else  if (
            ( currentValues.includes( seq[0] ) && currentValues.includes( seq[2] ) && !anotherCurrentValues.includes( seq[1] ) )
          ) {
            foundAnotherMove = seq[1];
          }
        }
      } else {
        foundWinner = turn;
        setWinnerSequence( seq );
        foundAnotherMove = null;
        break;
      }
      startAt++;
    }
  } else {
    let startAt = 0 ;
    while (startAt < winnerData.length) {
      const seq = winnerData[startAt];
      foundAnotherMove = WhenOneInSequence(seq, currentValues, anotherCurrentValues);
      if (foundAnotherMove !== null) {
        break;
      }
      startAt++;
    }
  }

  // console.log('foundAnotherMove with V2 ', foundAnotherMove , foundWinner);
  if (foundWinner) {
    setWinner( foundWinner );
  } else if (foundAnotherMove === null) {
    foundAnotherMove = FindAnotherEasy(
      contextsData
    );
  }

  return foundAnotherMove as MovePositionType;
}

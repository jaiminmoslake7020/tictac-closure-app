import {
  MovePositionType,
  MovePositionTypeWithNull,
  WinnerType,
} from '@types-dir/index';
import { turnData, winnerData } from '@data/index';
import { FindAnotherMedium } from './FindAnotherMedium';
import {
  checkGameCompleted,
  InitializeContextsFunctionType,
  useContextTurnStorage,
  useContextWinner,
  useContextWinnerSeq,
} from '@contexts/index';

export const FindAnotherHard = (
  contextsData: InitializeContextsFunctionType,
): MovePositionType | undefined => {
  const { turn, anotherTurn } = turnData;
  const { getTurnStorage } = useContextTurnStorage(contextsData);
  const { setWinnerSequence } = useContextWinnerSeq(contextsData);
  const { setWinner } = useContextWinner(contextsData);
  const turnStorage = getTurnStorage();

  let foundWinner = null as WinnerType;
  let foundAnotherMove = null as MovePositionTypeWithNull;

  const currentValues = turnStorage[turn] || [];
  const anotherCurrentValues = turnStorage[anotherTurn] || [];
  if (checkGameCompleted(contextsData)) {
    return undefined;
  }

  if (anotherCurrentValues.length >= 2) {
    let startAt = 0;
    while (startAt < winnerData.length) {
      const seq = winnerData[startAt];
      if (
        !(
          currentValues.includes(seq[0]) &&
          currentValues.includes(seq[1]) &&
          currentValues.includes(seq[2])
        )
      ) {
        if (foundAnotherMove === null) {
          if (
            anotherCurrentValues.includes(seq[0]) &&
            anotherCurrentValues.includes(seq[1]) &&
            !currentValues.includes(seq[2])
          ) {
            foundAnotherMove = seq[2];
            foundWinner = anotherTurn;
            setWinnerSequence(seq);
            break;
          } else if (
            anotherCurrentValues.includes(seq[1]) &&
            anotherCurrentValues.includes(seq[2]) &&
            !currentValues.includes(seq[0])
          ) {
            foundAnotherMove = seq[0];
            foundWinner = anotherTurn;
            setWinnerSequence(seq);
            break;
          } else if (
            anotherCurrentValues.includes(seq[2]) &&
            anotherCurrentValues.includes(seq[0]) &&
            !currentValues.includes(seq[1])
          ) {
            foundAnotherMove = seq[1];
            foundWinner = anotherTurn;
            setWinnerSequence(seq);
            break;
          }
        }
      } else {
        foundWinner = turn;
        setWinnerSequence(seq);
        foundAnotherMove = null;
        break;
      }
      startAt++;
    }
  }

  // console.log('foundAnotherMove with V3 ', foundAnotherMove , foundWinner);
  if (foundWinner) {
    setWinner(foundWinner);
  } else if (null === foundAnotherMove) {
    foundAnotherMove = FindAnotherMedium(contextsData);
  }

  return foundAnotherMove as MovePositionType;
};

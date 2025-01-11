import { MovePositionType, TurnType } from '@types-dir/index';
import { allData } from '@data/index';
import {
  InitializeContextsFunctionType,
  useContextTurnStorage,
} from '@contexts/index';

export const FindAnotherEasy = (
  contextsData: InitializeContextsFunctionType,
): MovePositionType => {
  const { getTurnStorage } = useContextTurnStorage(contextsData);
  const turnStorage = getTurnStorage();
  const keys = Object.keys(turnStorage);
  let keysStartAt = 0;
  let totalValues = [] as MovePositionType[];
  while (keysStartAt < keys.length) {
    const currentValues = turnStorage[keys[keysStartAt] as TurnType];
    totalValues = [...totalValues, ...currentValues];
    keysStartAt++;
  }
  const remainingMoves = allData.filter((v) => !totalValues.includes(v));
  // console.log('remainingMoves', remainingMoves, allData, totalValues);
  //  console.log('foundAnotherMove V1 Random ');
  return remainingMoves[
    Math.floor(Math.random() * (remainingMoves.length - 1))
  ];
};

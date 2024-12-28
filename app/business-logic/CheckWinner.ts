import { TurnType, WiningSequenceType, WinnerType } from '@types-dir/index';
import { winnerData } from '@data/index';
import {
  InitializeContextsFunctionType, useContextGameId,
  useContextTurnStorage,
  useContextWinner,
  useContextWinnerSeq
} from '@contexts/index';

export type setAtFirebaseType = (contextsData: InitializeContextsFunctionType, v: WinnerType) => void

export const CheckWinner = async (
  contextsData: InitializeContextsFunctionType,
  setAtFirebase?: setAtFirebaseType
) => {
  const { setWinner, getWinner } = useContextWinner( contextsData );
  const winner = getWinner();
  if (!winner) {
    const { getTurnStorage } = useContextTurnStorage( contextsData );
    const { setWinnerSequence } = useContextWinnerSeq( contextsData );
    const turnStorage = getTurnStorage();
    let foundWinner = null as WinnerType;
    const keys = Object.keys(turnStorage);
    let keysStartAt = 0 ;
    while( keysStartAt < keys.length ) {
      const currentValues = turnStorage[ keys[keysStartAt] as TurnType ];
      if (currentValues.length >= 3) {
        let startAt = 0 ;
        while (startAt < winnerData.length) {
          const seq = winnerData[startAt] as WiningSequenceType;
          if (currentValues.includes( seq[0] ) && currentValues.includes( seq[1] ) && currentValues.includes( seq[2] )) {
            foundWinner = keys[keysStartAt] as TurnType;
            setWinnerSequence( seq );
            break;
          }
          startAt++;
        }
      }
      if (foundWinner !== null) {
        break;
      }
      keysStartAt++;
    }
    if (foundWinner) {
      setWinner( foundWinner );
      if (setAtFirebase) {
        setAtFirebase(contextsData, foundWinner);
      }
    }
    if ([turnStorage["O"],turnStorage["X"]].length === 9) {
      setWinner( 'NONE' );
    }
  }
}

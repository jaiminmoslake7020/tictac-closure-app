import { TurnType, WiningSequenceType, WinnerType } from '../types';
import { winnerData } from '../data';
import {
  InitializeContextsFunctionType,
  useContextTurnStorage,
  useContextWinner,
  useContextWinnerSeq
} from '../contexts';

export const CheckWinner = (
  contextsData: InitializeContextsFunctionType
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
    }
    if ([turnStorage["O"],turnStorage["X"]].length === 9) {
      setWinner( 'NONE' );
    }
  }
}

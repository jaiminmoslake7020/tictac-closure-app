import {MovePositionType, TurnStorageType, TurnType, WiningSequenceTypeWithNull, WinnerType} from '../types';

export type useWinnerHookType = {
  getWinner: () => WinnerType,
  setWinner: (v: WinnerType) => void
};

export const useWinnerHook = () : useWinnerHookType => {
  let winner = null as WinnerType ;

  const setWinner = (v:WinnerType) => {
    winner = v;
  }

  const getWinner = () => {
    return winner;
  }

  return {
    getWinner, setWinner
  };
}

export type useWinnerSeqHookType = {
  getWinnerSequence: () => WiningSequenceTypeWithNull,
  setWinnerSequence: (v: WiningSequenceTypeWithNull) => void
};

export const useWinnerSeqHook = () : useWinnerSeqHookType => {
  let winnerSequence = null as WiningSequenceTypeWithNull ;

  const setWinnerSequence = (v:WiningSequenceTypeWithNull) => {
    winnerSequence = v;
  }

  const getWinnerSequence = () => {
    return winnerSequence;
  }

  return {
    getWinnerSequence, setWinnerSequence
  };
}

export type useTurnStorageHookType = {
  getTurnStorage: () => TurnStorageType,
  addNewTurn: (move: MovePositionType, turn: TurnType) => void
};

export const useTurnStorageHook = () : useTurnStorageHookType => {
  let turnStorage = {} as TurnStorageType;

  const setTurnStorage = (v:TurnStorageType) => {
    turnStorage = v;
  }

  const getTurnStorage = () => {
    return turnStorage;
  }

  const addNewTurn = (
    move: MovePositionType,
    turn: TurnType
  ) => {
    if (turnStorage[turn]) {
      setTurnStorage( {...turnStorage, [turn]: [ ...turnStorage[turn] ,move]} );
    } else {
      setTurnStorage( {...turnStorage, [turn]: [move]} );
    }
  }

  return {
    getTurnStorage, addNewTurn
  };
}

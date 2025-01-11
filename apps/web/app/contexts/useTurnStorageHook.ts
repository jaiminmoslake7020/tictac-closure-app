import {AnotherPersonMovePositionsTypeWithNull, MovePositionType, TurnStorageType, TurnType} from '@types-dir/index';
import {turnData} from '@data/index';

export type UseTurnStorageHookType = {
  getTurnStorage: () => TurnStorageType,
  addNewTurn: (move: MovePositionType, turn: TurnType) => void,
  getPlayerTurns: () => AnotherPersonMovePositionsTypeWithNull,
  getAnotherPlayerTurns: () => AnotherPersonMovePositionsTypeWithNull,
  resetTurnStorage: () => void
};

export const useTurnStorageHook = () : UseTurnStorageHookType => {
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

  const getPlayerTurns = () :AnotherPersonMovePositionsTypeWithNull => {
    return turnStorage[turnData.turn] ? turnStorage[turnData.turn] : null;
  }

  const getAnotherPlayerTurns = () : AnotherPersonMovePositionsTypeWithNull => {
    return turnStorage[turnData.anotherTurn] ? turnStorage[turnData.anotherTurn] : null;
  }

  const resetTurnStorage = () => {
    turnStorage = {};
  }

  return {
    getTurnStorage, addNewTurn, getPlayerTurns, getAnotherPlayerTurns, resetTurnStorage
  };
}

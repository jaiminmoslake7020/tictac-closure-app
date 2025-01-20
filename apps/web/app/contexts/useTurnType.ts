import { TurnType } from '@types-dir/index';
import { turnData } from '@data/index';

export type UseTurnHookType = {
  getTurn: () => TurnType;
  changeTurn: () => void;
  setUserTurn: () => void;
  setAnotherUserTurn: () => void;
  resetTurn: () => void;
};

export const useTurnHook = (): UseTurnHookType => {
  let turn = turnData.turn as TurnType;

  const setUserTurn = () => {
    turn = turnData.turn;
  };

  const setAnotherUserTurn = () => {
    turn = turnData.anotherTurn;
  };

  const changeTurn = () => {
    turn = turn === turnData.turn ? turnData.anotherTurn : turnData.turn;
  };

  const getTurn = (): TurnType => {
    return turn;
  };

  const resetTurn = (): void => {
    setUserTurn();
  };

  return {
    getTurn,
    changeTurn,
    setUserTurn,
    setAnotherUserTurn,
    resetTurn,
  };
};

import {TurnType} from '../types';
import {turnData} from '../data';

export type UseTurnHookType = {
  getTurn: () => TurnType,
  changeTurn: () => void
};

export const useTurnHook = () : UseTurnHookType => {
  let turn = turnData.turn as TurnType ;

  const changeTurn = () => {
    turn = turn === turnData.turn ? turnData.anotherTurn : turnData.turn;
  }

  const getTurn = () : TurnType => {
    return turn;
  }

  return {
    getTurn, changeTurn
  };
}

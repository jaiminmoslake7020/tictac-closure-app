import {TurnType} from '@types-dir/index';
import {turnData} from '@data/index';

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

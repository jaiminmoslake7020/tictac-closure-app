import { OpponentType } from '../types';

export type GameTypeHookType = {
  getGameType: () => OpponentType,
  setGameType: (v:OpponentType) => void,
};

// hooks should be component based
export const useGameLevel = () :GameTypeHookType => {
  let gameType: undefined | OpponentType;

  const setGameType = (item: OpponentType) => {
    gameType = item;
  }

  const getGameType = () : OpponentType => {
    return gameType as OpponentType;
  }

  return {
    getGameType,
    setGameType
  }
}


import { GamePlayerType } from '@types-dir/index';

export type UseGamePlayerTypeHookType = {
  setPlayerType: (item: GamePlayerType) => void;
  getPlayerType: () => GamePlayerType;
  removePlayerType: () => void;
};

export const useGamePlayerTypeHook = (): UseGamePlayerTypeHookType => {
  let playerType: GamePlayerType | undefined = undefined;
  const setPlayerType = (item: GamePlayerType) => {
    playerType = item;
  };
  const getPlayerType = (): GamePlayerType => {
    return playerType as GamePlayerType;
  };
  const removePlayerType = () => {
    playerType = undefined;
  };
  return {
    setPlayerType,
    getPlayerType,
    removePlayerType,
  };
};

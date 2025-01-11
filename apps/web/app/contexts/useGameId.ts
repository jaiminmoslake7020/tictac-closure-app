import {
  setGameId as setGameIdSession,
  getGameId as getGameIdSession,
  removeGameId as removeGameIdSession,
} from '@session/index';

export type UseGameIdHookType = {
  getGameId: () => string,
  setGameId: (v:string) => void,
  removeGameId: () => void,
  hasGameId: () => boolean
};

// hooks should be component based
export const useGameIdHook = () :UseGameIdHookType => {
  let gameId: undefined | string;

  const setGameId = (item: string) => {
    setGameIdSession(item);
    gameId = item;
  }

  const getGameId = () : string => {
    return gameId as string;
  }

  const hasGameId = () : boolean => {
    if (gameId) {
      return true;
    }
    const rV = getGameIdSession();
    if (rV) {
      gameId = rV;
      return true;
    }
    return gameId !== undefined;
  }

  const removeGameId = () : void => {
    gameId = undefined;
    removeGameIdSession();
  }

  return {
    getGameId,
    setGameId,
    removeGameId,
    hasGameId
  }
}


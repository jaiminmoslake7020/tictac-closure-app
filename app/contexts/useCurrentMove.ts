export type CurrentMoveHookType = {
  getCurrentMove: () => string,
  setCurrentMove: (v:string) => void,
};

// hooks should be component based
export const useCurrentMove = () :CurrentMoveHookType => {
  let gameType: undefined | string;

  const setCurrentMove = (item: string) => {
    gameType = item;
  }

  const getCurrentMove = () : string => {
    return gameType as string;
  }

  return {
    getCurrentMove,
    setCurrentMove
  }
}


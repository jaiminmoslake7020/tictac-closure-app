export type UseCurrentMoveHookType = {
  getCurrentMove: () => string,
  setCurrentMove: (v:string) => void,
};

// hooks should be component based
export const useCurrentMove = () :UseCurrentMoveHookType => {
  let gameType: undefined | string;

  const setCurrentMove = (item: string) => {
    // console.log("setCurrentMove", item);
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


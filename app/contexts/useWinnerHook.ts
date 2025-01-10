import {WinnerType} from '@types-dir/index';

export type UseWinnerHookType = {
  getWinner: () => WinnerType,
  setWinner: (v: WinnerType) => void,
  removeWinner: () => void
};

export const useWinnerHook = () : UseWinnerHookType => {
  let winner = null as WinnerType ;

  const setWinner = (v:WinnerType) => {
    if (winner === null) {
      winner = v;
    } else {
      console.error('winner is already set');
    }
  }

  const getWinner = () => {
    return winner;
  }

  const removeWinner = () => {
    winner = null
  }

  return {
    getWinner, setWinner, removeWinner
  };
}

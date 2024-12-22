import {WinnerType} from '@types-dir/index';

export type UseWinnerHookType = {
  getWinner: () => WinnerType,
  setWinner: (v: WinnerType) => void
};

export const useWinnerHook = () : UseWinnerHookType => {
  let winner = null as WinnerType ;

  const setWinner = (v:WinnerType) => {
    winner = v;
  }

  const getWinner = () => {
    return winner;
  }

  return {
    getWinner, setWinner
  };
}

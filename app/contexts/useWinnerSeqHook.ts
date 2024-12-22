import {WiningSequenceTypeWithNull} from '@types-dir/index';

export type UseWinnerSeqHookType = {
  getWinnerSequence: () => WiningSequenceTypeWithNull,
  setWinnerSequence: (v: WiningSequenceTypeWithNull) => void
};

export const useWinnerSeqHook = () : UseWinnerSeqHookType => {
  let winnerSequence = null as WiningSequenceTypeWithNull ;

  const setWinnerSequence = (v:WiningSequenceTypeWithNull) => {
    winnerSequence = v;
  }

  const getWinnerSequence = () => {
    return winnerSequence;
  }

  return {
    getWinnerSequence, setWinnerSequence
  };
}

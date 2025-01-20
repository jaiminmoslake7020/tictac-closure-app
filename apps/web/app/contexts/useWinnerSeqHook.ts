import { WiningSequenceTypeWithNull } from '@types-dir/index';

export type UseWinnerSeqHookType = {
  getWinnerSequence: () => WiningSequenceTypeWithNull;
  setWinnerSequence: (v: WiningSequenceTypeWithNull) => void;
  removeWinnerSequence: () => void;
};

export const useWinnerSeqHook = (): UseWinnerSeqHookType => {
  let winnerSequence = null as WiningSequenceTypeWithNull;

  const setWinnerSequence = (v: WiningSequenceTypeWithNull) => {
    winnerSequence = v;
  };

  const getWinnerSequence = () => {
    return winnerSequence;
  };

  const removeWinnerSequence = () => {
    winnerSequence = null;
  };

  return {
    getWinnerSequence,
    setWinnerSequence,
    removeWinnerSequence,
  };
};

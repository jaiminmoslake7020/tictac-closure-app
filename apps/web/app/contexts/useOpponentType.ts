import { OpponentType } from '@types-dir/index';
import {
  getOpponentType as getOpponentTypeSession,
  setOpponentType as setOpponentTypeSession,
  removeOpponentType as removeOpponentTypeSession,
} from '@session/index';

export type UseOpponentTypeHookType = {
  getOpponentType: () => OpponentType;
  setOpponentType: (v: OpponentType) => void;
  removeOpponentType: () => void;
  hasOpponentType: () => boolean;
};

// hooks should be component based
export const useOpponentType = (): UseOpponentTypeHookType => {
  let opponentType: undefined | OpponentType;

  const setOpponentType = (item: OpponentType) => {
    setOpponentTypeSession(item);
    opponentType = item;
  };

  const getOpponentType = (): OpponentType => {
    const opponentTypeStorage = getOpponentTypeSession();
    if (opponentTypeStorage) {
      setOpponentType(opponentTypeStorage as OpponentType);
    }
    return opponentType as OpponentType;
  };

  const hasOpponentType = (): boolean => {
    if (opponentType) {
      return true;
    }
    const opponentTypeStorage = getOpponentTypeSession();
    if (opponentTypeStorage) {
      setOpponentType(opponentTypeStorage as OpponentType);
      return true;
    }
    return false;
  };

  const removeOpponentType = (): void => {
    opponentType = undefined;
    removeOpponentTypeSession();
  };

  return {
    getOpponentType,
    setOpponentType,
    removeOpponentType,
    hasOpponentType,
  };
};

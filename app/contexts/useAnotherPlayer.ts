import {UserType} from '@types-dir/index';

export type UseAnotherPlayerHookType = {
  getAnotherPlayer: () => UserType,
  setAnotherPlayer: (v:UserType) => void,
};

// hooks should be component based
export const useAnotherPlayer = () :UseAnotherPlayerHookType => {
  let gameType: undefined | UserType;

  const setAnotherPlayer = (item: UserType) => {
    gameType = item;
  }

  const getAnotherPlayer = () : UserType => {
    return gameType as UserType;
  }

  return {
    getAnotherPlayer,
    setAnotherPlayer
  }
}


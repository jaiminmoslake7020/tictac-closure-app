import {UserType} from '@types-dir/index';

export type AnotherPlayerHookType = {
  getAnotherPlayer: () => UserType,
  setAnotherPlayer: (v:UserType) => void,
};

// hooks should be component based
export const useAnotherPlayer = () :AnotherPlayerHookType => {
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


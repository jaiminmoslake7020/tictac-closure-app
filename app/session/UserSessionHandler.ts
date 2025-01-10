import {UserType} from '@types-dir/index';
import {getSession, removeSession, setSession} from './SessionHandler';

export type UserSessionHandlerType = {
  getUser: () => UserType | undefined,
  setUser: (user: UserType) => void,
  logoutUser: () => void,
  checkUserExists: () => boolean
}

export const UserSessionHandler = () :UserSessionHandlerType => {

  const getUser = () => {
    return getSession()?.user;
  }

  const setUser = (user: UserType) => {
    setSession(getSession() === null ? {
      user,
    } : {
      ...getSession(),
      user,
    });
  }

  const logoutUser = () => {
    removeSession();
  }

  const checkUserExists = () : boolean => {
    return getSession() !== null ;
  }

  return {
    getUser,
    setUser,
    logoutUser,
    checkUserExists
  }
}

const {
  setUser,
  getUser,
  logoutUser,
  checkUserExists
} = UserSessionHandler();

export {
  setUser,
  getUser,
  logoutUser,
  checkUserExists
};

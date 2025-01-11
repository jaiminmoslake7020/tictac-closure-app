import {UserType} from '@types-dir/index';
import {
  getUser as getUserSession,
  setUser as setUserSession,
  logoutUser as logoutUserSession
} from '@session/index';

export type UserSessionHookType = {
  getUser: () => UserType,
  setUser: (v:UserType) => void,
  checkUserExists: () => boolean,
  logoutUser: () => void
};

// hooks should be component based
export const useUserSession = () :UserSessionHookType => {
  let user: undefined | UserType;

  const setUser = (item: UserType) => {
    if ( item && item.id && item.username ) {
      setUserSession(item);
    }
    user = item;
  }

  const checkUserExists = () : boolean => {
    if (user && user.id && user.username ) {
      return true;
    }
    const userStorage  = getUserSession() as UserType;
    if ( userStorage && userStorage.id && userStorage.username) {
      setUser( userStorage as UserType );
      return true;
    }
    return false;
  }

  const getUser = () : UserType => {
    const userStorage  = getUserSession() as UserType;
    if ( userStorage && userStorage.id && userStorage.username && !user ) {
      setUser( userStorage as UserType );
    }
    return user as UserType;
  }

  const logoutUser = () => {
    logoutUserSession();
    user = undefined;
  }

  return {
    getUser,
    setUser,
    checkUserExists,
    logoutUser
  }
}


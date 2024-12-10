import {UserType} from '../types';

export type UserSessionHookType = {
  getUser: () => UserType,
  setUser: (v:UserType) => void,
};

// hooks should be component based
export const useUserSession = () :UserSessionHookType => {
  let user: undefined | UserType;

  const setUser = (item: UserType) => {
    if ( item && item.id && item.username ) {
      localStorage.setItem('user', JSON.stringify(item));
    }
    user = item;
  }

  const getUser = () : UserType => {
    const userStorage  = JSON.parse((localStorage.getItem('user') as string)) as UserType;
    if ( userStorage && userStorage.id && userStorage.username ) {
      setUser( userStorage as UserType );
    }
    return user as UserType;
  }

  return {
    getUser,
    setUser
  }
}


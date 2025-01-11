import {AppLevelType, OpponentType, UserType} from '@types-dir/index';

export type SessionType = {
  user: UserType,
  roomCodeId?: string,
  gameId?: string,
  appLevelType?: AppLevelType,
  opponentType?: OpponentType
};

export type SessionHandlerType = {
  initSession: () => void,
  setSession: (session: SessionType) => void,
  getSession: () => SessionType,
  removeSession: () => void
}

const SessionHandler = () : SessionHandlerType => {
  let session : SessionType | null = null ;

  const initSession = () => {
    const s : string | null = localStorage.getItem('tic-tac-app-session');
    if (s === null) {
      session = s;
    } else {
      session = JSON.parse(s);
    }
  }

  const getSession = () : SessionType => {
    return session as SessionType;
  }

  const setSession = (sessionArg: SessionType) => {
    localStorage.setItem('tic-tac-app-session', JSON.stringify( sessionArg ));
    session = sessionArg;
  }

  const removeSession = () => {
    localStorage.removeItem('tic-tac-app-session');
    // clearing all other session data
    localStorage.clear();
    session = null ;
  }

  return {
    initSession,
    setSession,
    getSession,
    removeSession
  }
}


const {
  initSession,
  getSession,
  setSession,
  removeSession
} = SessionHandler();

export {
  initSession,
  getSession,
  setSession,
  removeSession
};

import {AppLevelHookType, useAppLevel} from './useAppLevel';
import {GameTypeHookType, useGameLevel} from './useGameLevel';
import {AnotherPlayerHookType, useAnotherPlayer} from './useAnotherPlayer';
import {CurrentMoveHookType, useCurrentMove} from './useCurrentMove';
import {UserSessionHookType, useUserSession} from './useUser';
import {useTurnStorageHook, UseTurnStorageHookType} from './useTurnStorageHook';
import {useWinnerSeqHook, UseWinnerSeqHookType} from './useWinnerSeqHook';
import {useWinnerHook, UseWinnerHookType} from './useWinnerHook';
import {useTurnHook, UseTurnHookType} from './useTurnType';
import {useRoomCodeIdHook, UseRoomCodeIdHookType} from './useRoomCodeId';

export type {
  AppLevelHookType,
  GameTypeHookType,
  AnotherPlayerHookType,
  CurrentMoveHookType,
  UserSessionHookType,
  UseTurnStorageHookType,
  UseWinnerSeqHookType,
  UseWinnerHookType,
  UseTurnHookType,
  UseRoomCodeIdHookType
};

export type InitializeContextsFunctionType = {
  addContext: (name: string, value: any) => void,
  getContext: (name:string) => any,
  hasContext: (name:string) => boolean,
};

export const initializeContexts = () : InitializeContextsFunctionType => {
  const contexts = new Map();

  const addContext = (name: string, value: any) => {
    contexts.set(name, value);
  }

  const getContext = (name: string) => {
    return contexts.get(name);
  }

  const hasContext = (name: string) => {
    return contexts.has(name);
  }

  return {
    addContext,
    getContext,
    hasContext
  }
}

export type contextType = 'AppLevelType' | 'GameType' | 'AnotherPlayer' | 'CurrentMove' | 'User' | 'TurnStorage' | 'WinnerSeq' | 'Winner' | 'TurnType' | 'RoomCodeId';

export const contextsMap = {
  AppLevelType: 'AppLevelType',
  GameType: 'GameType',
  AnotherPlayer: 'AnotherPlayer',
  CurrentMove: 'CurrentMove',
  User: 'User',
  TurnStorage: 'TurnStorage',
  WinnerSeq: 'WinnerSeq',
  Winner: 'Winner',
  TurnType: 'TurnType',
  RoomCodeId: 'RoomCodeId'
} as Record<contextType, contextType>;

// contexts should be global and share state between app or atlest nodeTree where it starts
export const useContexts = (contextName: string, contextsMapList : InitializeContextsFunctionType) => {
  const {
    addContext,
    getContext,
    hasContext
  } = contextsMapList;

  if (contextName === contextsMap.AppLevelType) {
    if ( hasContext(contextName) ) {
      return getContext(contextName);
    }
    const firstInstance = useAppLevel();
    addContext(contextName, firstInstance);
    return firstInstance as AppLevelHookType;
  } else if (contextName === contextsMap.GameType) {
    if ( hasContext(contextName) ) {
      return getContext(contextName);
    }
    const firstInstance = useGameLevel();
    addContext(contextName, firstInstance);
    return firstInstance as GameTypeHookType;
  } else if (contextName === contextsMap.AnotherPlayer) {
    if ( hasContext(contextName) ) {
      return getContext(contextName);
    }
    const firstInstance = useAnotherPlayer();
    addContext(contextName, firstInstance);
    return firstInstance as AnotherPlayerHookType;
  } else if (contextName === contextsMap.CurrentMove) {
    if ( hasContext(contextName) ) {
      return getContext(contextName);
    }
    const firstInstance = useCurrentMove();
    addContext(contextName, firstInstance);
    return firstInstance as CurrentMoveHookType;
  } else if (contextName === contextsMap.User) {
    if ( hasContext(contextName) ) {
      return getContext(contextName);
    }
    const firstInstance = useUserSession();
    addContext(contextName, firstInstance);
    return firstInstance as UserSessionHookType;
  } else if (contextName === contextsMap.TurnStorage ) {
    if ( hasContext(contextName) ) {
      return getContext(contextName);
    }
    const firstInstance = useTurnStorageHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseTurnStorageHookType;
  } else if (contextName === contextsMap.WinnerSeq ) {
    if ( hasContext(contextName) ) {
      return getContext(contextName);
    }
    const firstInstance = useWinnerSeqHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseWinnerSeqHookType;
  } else if (contextName === contextsMap.Winner ) {
    if ( hasContext(contextName) ) {
      return getContext(contextName);
    }
    const firstInstance = useWinnerHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseWinnerHookType;
  } else if (contextName === contextsMap.TurnType ) {
    if ( hasContext(contextName) ) {
      return getContext(contextName);
    }
    const firstInstance = useTurnHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseTurnHookType;
  } else if (contextName === contextsMap.RoomCodeId ) {
    if ( hasContext(contextName) ) {
      return getContext(contextName);
    }
    const firstInstance = useRoomCodeIdHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseRoomCodeIdHookType;
  }

}

export const useContextAppLevelType = (contextsData : InitializeContextsFunctionType) : AppLevelHookType => {
  return  useContexts( contextsMap.AppLevelType , contextsData ) as AppLevelHookType;
}

export const useContextGameType = (contextsData : InitializeContextsFunctionType) : GameTypeHookType => {
  return  useContexts( contextsMap.GameType , contextsData ) as GameTypeHookType;
}

export const useContextAnotherPlayer = (contextsData : InitializeContextsFunctionType) : AnotherPlayerHookType => {
  return  useContexts( contextsMap.AnotherPlayer , contextsData ) as AnotherPlayerHookType;
}

export const useContextCurrentMove = (contextsData : InitializeContextsFunctionType) : CurrentMoveHookType => {
  return  useContexts( contextsMap.CurrentMove , contextsData ) as CurrentMoveHookType;
}

export const useContextUserSession = (contextsData : InitializeContextsFunctionType) : UserSessionHookType => {
  return  useContexts( contextsMap.User , contextsData ) as UserSessionHookType;
}

export const useContextTurnStorage = (contextsData : InitializeContextsFunctionType) : UseTurnStorageHookType => {
  return  useContexts( contextsMap.TurnStorage , contextsData ) as UseTurnStorageHookType;
}

export const useContextWinner = (contextsData : InitializeContextsFunctionType) : UseWinnerHookType => {
  return  useContexts( contextsMap.Winner , contextsData ) as UseWinnerHookType;
}

export const useContextWinnerSeq = (contextsData : InitializeContextsFunctionType) : UseWinnerSeqHookType => {
  return  useContexts( contextsMap.WinnerSeq , contextsData ) as UseWinnerSeqHookType;
}

export const useContextTurnHookType = (contextsData : InitializeContextsFunctionType) : UseTurnHookType => {
  return  useContexts( contextsMap.TurnType , contextsData ) as UseTurnHookType;
}

export const useContextRoomCodeId = (contextsData : InitializeContextsFunctionType) : UseRoomCodeIdHookType => {
  return  useContexts( contextsMap.RoomCodeId , contextsData ) as UseRoomCodeIdHookType;
}

export const isItRemoteGame = (contextsData:InitializeContextsFunctionType) : boolean => {
  const {
    getGameType
  } = useContextGameType( contextsData );

  return getGameType() === 'remote-friend-player' || getGameType() === 'remote-random-player';
}

export const isItRemotePlayerTurn = (contextsData:InitializeContextsFunctionType) : boolean => {
  const {
    getCurrentMove
  } = useContextCurrentMove( contextsData );

  const {
    getUser
  } = useContextUserSession( contextsData );

  const currentMove = getCurrentMove();
  const user = getUser();
  return currentMove !== user.id
}

import { UseAppLevelHookType, useAppLevel } from './useAppLevel';
import { UseOpponentTypeHookType, useOpponentType } from './useOpponentType';
import { UseAnotherPlayerHookType, useAnotherPlayer } from './useAnotherPlayer';
import { UseCurrentMoveHookType, useCurrentMove } from './useCurrentMove';
import { UserSessionHookType, useUserSession } from './useUser';
import {
  UseTurnStorageHookType,
  useTurnStorageHook,
} from './useTurnStorageHook';
import { UseWinnerSeqHookType, useWinnerSeqHook } from './useWinnerSeqHook';
import { UseWinnerHookType, useWinnerHook } from './useWinnerHook';
import { UseTurnHookType, useTurnHook } from './useTurnType';
import { UseRoomCodeIdHookType, useRoomCodeIdHook } from './useRoomCodeId';
import { UseGameIdHookType, useGameIdHook } from '@contexts/useGameId';
import { ColumnIdType, MovePositionType, UserType } from '@types-dir/index';
import { getRandomInt } from '@utils/index';
import {
  useGamePlayerTypeHook,
  UseGamePlayerTypeHookType,
} from '@contexts/useGamePlayerType';
import {
  computerProgram,
  openAiChatGpt,
  remoteFriendPlayer,
  remoteRandomPlayer,
  sameDevicePlay,
  turnData,
} from '@data/index';

export type {
  UseAppLevelHookType,
  UseOpponentTypeHookType,
  UseAnotherPlayerHookType,
  UseCurrentMoveHookType,
  UserSessionHookType,
  UseTurnStorageHookType,
  UseWinnerSeqHookType,
  UseWinnerHookType,
  UseTurnHookType,
  UseRoomCodeIdHookType,
  UseGameIdHookType,
};

export type InitializeContextsFunctionType = {
  addContext: (name: string, value: any) => void;
  getContext: (name: string) => any;
  hasContext: (name: string) => boolean;
};

export const initializeContexts = (): InitializeContextsFunctionType => {
  const contexts = new Map();

  const addContext = (name: string, value: any) => {
    contexts.set(name, value);
  };

  const getContext = (name: string) => {
    return contexts.get(name);
  };

  const hasContext = (name: string) => {
    return contexts.has(name);
  };

  return {
    addContext,
    getContext,
    hasContext,
  };
};

export type contextType =
  | 'AppLevelType'
  | 'OpponentType'
  | 'AnotherPlayer'
  | 'CurrentMove'
  | 'User'
  | 'TurnStorage'
  | 'WinnerSeq'
  | 'Winner'
  | 'TurnType'
  | 'RoomCodeId'
  | 'GameId'
  | 'GamePlayerType';

export const contextsMap = {
  AppLevelType: 'AppLevelType',
  OpponentType: 'OpponentType',
  AnotherPlayer: 'AnotherPlayer',
  CurrentMove: 'CurrentMove',
  User: 'User',
  TurnStorage: 'TurnStorage',
  WinnerSeq: 'WinnerSeq',
  Winner: 'Winner',
  TurnType: 'TurnType',
  RoomCodeId: 'RoomCodeId',
  GameId: 'GameId',
  GamePlayerType: 'GamePlayerType',
} as Record<contextType, contextType>;

// contexts should be global and share state between app or atlest nodeTree where it starts
export const useContexts = (
  contextName: string,
  contextsMapList: InitializeContextsFunctionType
) => {
  const { addContext, getContext, hasContext } = contextsMapList;

  if (contextName === contextsMap.AppLevelType) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useAppLevel();
    addContext(contextName, firstInstance);
    return firstInstance as UseAppLevelHookType;
  } else if (contextName === contextsMap.OpponentType) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useOpponentType();
    addContext(contextName, firstInstance);
    return firstInstance as UseOpponentTypeHookType;
  } else if (contextName === contextsMap.AnotherPlayer) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useAnotherPlayer();
    addContext(contextName, firstInstance);
    return firstInstance as UseAnotherPlayerHookType;
  } else if (contextName === contextsMap.CurrentMove) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useCurrentMove();
    addContext(contextName, firstInstance);
    return firstInstance as UseCurrentMoveHookType;
  } else if (contextName === contextsMap.User) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useUserSession();
    addContext(contextName, firstInstance);
    return firstInstance as UserSessionHookType;
  } else if (contextName === contextsMap.TurnStorage) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useTurnStorageHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseTurnStorageHookType;
  } else if (contextName === contextsMap.WinnerSeq) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useWinnerSeqHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseWinnerSeqHookType;
  } else if (contextName === contextsMap.Winner) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useWinnerHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseWinnerHookType;
  } else if (contextName === contextsMap.TurnType) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useTurnHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseTurnHookType;
  } else if (contextName === contextsMap.RoomCodeId) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useRoomCodeIdHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseRoomCodeIdHookType;
  } else if (contextName === contextsMap.GameId) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useGameIdHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseGameIdHookType;
  } else if (contextName === contextsMap.GamePlayerType) {
    if (hasContext(contextName)) {
      return getContext(contextName);
    }
    const firstInstance = useGamePlayerTypeHook();
    addContext(contextName, firstInstance);
    return firstInstance as UseGamePlayerTypeHookType;
  } else {
    throw new Error('Unknown context name');
  }
};

export const useContextAppLevelType = (
  contextsData: InitializeContextsFunctionType
): UseAppLevelHookType => {
  return useContexts(
    contextsMap.AppLevelType,
    contextsData
  ) as UseAppLevelHookType;
};

export const useContextOpponentType = (
  contextsData: InitializeContextsFunctionType
): UseOpponentTypeHookType => {
  return useContexts(
    contextsMap.OpponentType,
    contextsData
  ) as UseOpponentTypeHookType;
};

export const useContextAnotherPlayer = (
  contextsData: InitializeContextsFunctionType
): UseAnotherPlayerHookType => {
  return useContexts(
    contextsMap.AnotherPlayer,
    contextsData
  ) as UseAnotherPlayerHookType;
};

export const useContextCurrentMove = (
  contextsData: InitializeContextsFunctionType
): UseCurrentMoveHookType => {
  return useContexts(
    contextsMap.CurrentMove,
    contextsData
  ) as UseCurrentMoveHookType;
};

export const useContextUserSession = (
  contextsData: InitializeContextsFunctionType
): UserSessionHookType => {
  return useContexts(contextsMap.User, contextsData) as UserSessionHookType;
};

export const useContextTurnStorage = (
  contextsData: InitializeContextsFunctionType
): UseTurnStorageHookType => {
  return useContexts(
    contextsMap.TurnStorage,
    contextsData
  ) as UseTurnStorageHookType;
};

export const useContextWinner = (
  contextsData: InitializeContextsFunctionType
): UseWinnerHookType => {
  return useContexts(contextsMap.Winner, contextsData) as UseWinnerHookType;
};

export const useContextWinnerSeq = (
  contextsData: InitializeContextsFunctionType
): UseWinnerSeqHookType => {
  return useContexts(
    contextsMap.WinnerSeq,
    contextsData
  ) as UseWinnerSeqHookType;
};

export const useContextTurnHookType = (
  contextsData: InitializeContextsFunctionType
): UseTurnHookType => {
  return useContexts(contextsMap.TurnType, contextsData) as UseTurnHookType;
};

export const useContextRoomCodeId = (
  contextsData: InitializeContextsFunctionType
): UseRoomCodeIdHookType => {
  return useContexts(
    contextsMap.RoomCodeId,
    contextsData
  ) as UseRoomCodeIdHookType;
};

export const useContextGameId = (
  contextsData: InitializeContextsFunctionType
): UseGameIdHookType => {
  return useContexts(contextsMap.GameId, contextsData) as UseGameIdHookType;
};

export const useContextGamePlayerType = (
  contextsData: InitializeContextsFunctionType
): UseGamePlayerTypeHookType => {
  return useContexts(
    contextsMap.GamePlayerType,
    contextsData
  ) as UseGamePlayerTypeHookType;
};

export const isItRemoteGame = (
  contextsData: InitializeContextsFunctionType
): boolean => {
  const { getOpponentType } = useContextOpponentType(contextsData);
  return (
    getOpponentType() === remoteFriendPlayer ||
    getOpponentType() === remoteRandomPlayer
  );
};

export const isItGameWithOpenAi = (
  contextsData: InitializeContextsFunctionType
): boolean => {
  const { getOpponentType } = useContextOpponentType(contextsData);
  return getOpponentType() === openAiChatGpt;
};

export const isItSameDeviceGame = (
  contextsData: InitializeContextsFunctionType
): boolean => {
  const { getOpponentType } = useContextOpponentType(contextsData);
  return (
    getOpponentType() === sameDevicePlay ||
    getOpponentType() === computerProgram
  );
};

export const getGameIdWithRoomCode = (
  contextsData: InitializeContextsFunctionType
): {
  roomCodeId: string;
  gameId: string;
} | null => {
  const { getRoomCodeId, hasRoomCodeId } = useContextRoomCodeId(contextsData);
  const { getGameId, hasGameId } = useContextGameId(contextsData);
  if (hasRoomCodeId() && hasGameId()) {
    return {
      roomCodeId: getRoomCodeId(),
      gameId: getGameId(),
    };
  }
  return null;
};

export const getGameDocumentPath = (
  contextsData: InitializeContextsFunctionType
): string | undefined => {
  const { roomCodeId, gameId } = getGameIdWithRoomCode(contextsData) || {};
  if (!roomCodeId) {
    return undefined;
  }
  if (!gameId) {
    return undefined;
  }
  return `rooms/${roomCodeId}/games/${gameId}`;
};

export const getTurnStorageCollectionPath = (
  contextsData: InitializeContextsFunctionType
): string => {
  return `${getGameDocumentPath(contextsData)}/turnStorage`;
};

export const isItRemotePlayerTurn = (
  contextsData: InitializeContextsFunctionType
): boolean => {
  const { getCurrentMove } = useContextCurrentMove(contextsData);

  const { getUser } = useContextUserSession(contextsData);

  const currentMove = getCurrentMove();
  const user = getUser();
  return currentMove !== user.id;
};

export const getRandomMove = (
  contextsData: InitializeContextsFunctionType
): string => {
  const { getUser } = useContextUserSession(contextsData);

  const { getAnotherPlayer } = useContextAnotherPlayer(contextsData);

  const userItem = getUser() as UserType;
  const idArray = [userItem.id, getAnotherPlayer().id] as string[];
  const number = getRandomInt(0, 1);
  return idArray[number];
};

export const getUserId = (
  contextsData: InitializeContextsFunctionType
): string => {
  const { getUser } = useContextUserSession(contextsData);
  const userItem = getUser() as UserType;
  return userItem.id;
};

export const getAllCurrentTurns = (
  contextsData: InitializeContextsFunctionType
): MovePositionType[] => {
  const { getTurnStorage } = useContextTurnStorage(contextsData);
  const turnStorage = getTurnStorage();
  return [
    ...(turnStorage[turnData.turn] || []),
    ...(turnStorage[turnData.anotherTurn] || []),
  ];
};

export const getNumberOfTurnsMade = (
  contextsData: InitializeContextsFunctionType
): number => {
  return getAllCurrentTurns(contextsData).length;
};

export const isUsedTurn = (
  contextsData: InitializeContextsFunctionType,
  columnId: ColumnIdType
) => {
  const moveType = columnId.replace('-', '') as MovePositionType;
  return getAllCurrentTurns(contextsData).includes(moveType);
};

export const checkGameCompleted = (
  contextsData: InitializeContextsFunctionType
) => {
  return getAllCurrentTurns(contextsData).length === 9;
};

export const removeGameContextsData = (
  contextsData: InitializeContextsFunctionType
) => {
  const { resetTurnStorage } = useContextTurnStorage(contextsData);
  const { removeWinnerSequence } = useContextWinnerSeq(contextsData);
  const { removeWinner } = useContextWinner(contextsData);
  resetTurnStorage();
  removeWinnerSequence();
  removeWinner();

  if (isItSameDeviceGame(contextsData)) {
    const { resetTurn } = useContextTurnHookType(contextsData);
    resetTurn();
  }
};

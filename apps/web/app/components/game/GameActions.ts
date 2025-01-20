import {
  InitializeContextsFunctionType,
  useContextGameId,
  useContextRoomCodeId,
  useContextUserSession,
  UseRoomCodeIdHookType,
  UserSessionHookType,
  UseGameIdHookType,
  useContextOpponentType,
  isItRemoteGame,
} from '@contexts/index';
import { exitRoom as exitRoomFirebase } from '@firebase-dir/room';
import { unliveUser } from '@firebase-dir/user';

export type GameActionCallbacksType = {
  onExitRoom: () => void;
  onLogout: () => void;
  onGameTypeChanged: () => void;
};

export type GameActionsType = {
  exitRoom: () => void;
  logout: () => void;
  changeGameType: () => void;
};

export const GameActions = (
  contextsData: InitializeContextsFunctionType,
  gameActionCallbacks: GameActionCallbacksType,
): GameActionsType => {
  const { removeRoomCodeId, getRoomCodeId } = useContextRoomCodeId(
    contextsData,
  ) as UseRoomCodeIdHookType;
  const { removeGameId } = useContextGameId(contextsData) as UseGameIdHookType;
  const { logoutUser, getUser } = useContextUserSession(contextsData) as UserSessionHookType;
  const { removeOpponentType } = useContextOpponentType(contextsData);

  const { onExitRoom, onLogout, onGameTypeChanged } = gameActionCallbacks;

  const changeGameType = async () => {
    if (isItRemoteGame(contextsData)) {
      const room = getRoomCodeId();
      const u = getUser();
      await exitRoomFirebase(room);
      removeGameId();
      removeRoomCodeId();
    }
    removeOpponentType(); // it makes sense to ask the user to select a new opponent,
    onGameTypeChanged();
  };

  const exitRoom = async () => {
    document.querySelector('.main')?.remove();
    const room = getRoomCodeId();
    const u = getUser();
    await exitRoomFirebase(room);
    removeGameId();
    removeOpponentType(); // it makes sense to ask the user to select a new opponent
    removeRoomCodeId();
    onExitRoom();
  };

  const logout = async () => {
    document.querySelector('.main')?.remove();
    await unliveUser(getUser().id);

    removeGameId();
    removeOpponentType(); // it makes sense to ask the user to select a new opponent
    removeRoomCodeId();

    logoutUser();
    onLogout();
  };

  return {
    exitRoom,
    logout,
    changeGameType,
  };
};

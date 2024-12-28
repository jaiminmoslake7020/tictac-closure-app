import {
  InitializeContextsFunctionType,
  useContextGameId,
  useContextRoomCodeId, useContextUserSession,
  UseRoomCodeIdHookType, UserSessionHookType,
  UseGameIdHookType
} from '@contexts/index';
import {
  exitRoom as exitRoomFirebase
} from '@firebase-dir/room';

export const GameActions = ( contextsData: InitializeContextsFunctionType , onExitGame : () => void, onExitRoom : () => void, onLogout : () => void) => {

  const { removeRoomCodeId, getRoomCodeId } = useContextRoomCodeId( contextsData ) as UseRoomCodeIdHookType;
  const { removeGameId, } = useContextGameId( contextsData ) as UseGameIdHookType;
  const { logoutUser, getUser } = useContextUserSession( contextsData ) as UserSessionHookType;

  const exitGame = () => {
    document.querySelector('.main')?.remove();
    removeGameId();
    onExitGame();
  }

  const exitRoom = async () => {
    document.querySelector('.main')?.remove();
    const room = getRoomCodeId();
    const u = getUser();
    await exitRoomFirebase(room, u.id);
    removeRoomCodeId();
    onExitRoom();
  }

  const logout = () => {
    document.querySelector('.main')?.remove();
    logoutUser();
    onLogout();
  }

  return {
    exitGame,
    exitRoom,
    logout
  };
}

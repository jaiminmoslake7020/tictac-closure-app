import {
  InitializeContextsFunctionType,
  useContextGameId,
  useContextRoomCodeId, useContextUserSession,
  UseRoomCodeIdHookType, UserSessionHookType,
  UseGameIdHookType, useContextOpponentType
} from '@contexts/index';
import {
  exitRoom as exitRoomFirebase
} from '@firebase-dir/room';
import {unliveUser} from '@firebase-dir/user';

export type GameActionCallbacksType = {
  // onExitGame: () => void;
  onExitRoom: () => void;
  onLogout: () => void;
}

export type GameActionsType = {
  // exitGame?: () => void;
  exitRoom: () => void;
  logout: () => void;
}

export const GameActions = ( contextsData: InitializeContextsFunctionType , gameActionCallbacks: GameActionCallbacksType) :GameActionsType => {

  const { removeRoomCodeId, getRoomCodeId } = useContextRoomCodeId( contextsData ) as UseRoomCodeIdHookType;
  const { removeGameId, } = useContextGameId( contextsData ) as UseGameIdHookType;
  const { logoutUser, getUser } = useContextUserSession( contextsData ) as UserSessionHookType;
  const {
    removeOpponentType
  } = useContextOpponentType( contextsData );

  const {
    onExitRoom, onLogout
  } = gameActionCallbacks;

  const exitGame = () => {
    // not in use
    // document.querySelector('.main')?.remove();
    // removeGameId();
    // onExitGame();
  }

  const exitRoom = async () => {
    document.querySelector('.main')?.remove();
    const room = getRoomCodeId();
    const u = getUser();
    await exitRoomFirebase(room, u.id);
    removeGameId();
    removeOpponentType(); // it makes sense to ask the user to select a new opponent
    removeRoomCodeId();
    onExitRoom();
  }

  const logout = async () => {
    document.querySelector('.main')?.remove();
    await unliveUser(getUser().id);

    removeGameId();
    removeOpponentType(); // it makes sense to ask the user to select a new opponent
    removeRoomCodeId();

    logoutUser();
    onLogout();
  }

  return {
    exitRoom,
    logout
  };
}

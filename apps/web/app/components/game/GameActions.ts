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
  removeGameContextsData,
} from '@contexts/index';
import { exitRoom as exitRoomFirebase } from '@firebase-dir/room';
import { unliveUser } from '@firebase-dir/user';
import { stopSubscribers } from '@components/game/firebase-subscriber/FirebaseSubscriber';

export type GameActionCallbacksType = {
  onExitRoom: () => void;
  onLogout: () => void;
  onGameTypeChanged: () => void;
  exitGame?: () => void;
};

export type GameActionsType = {
  exitRoom: () => void;
  logout: () => void;
  changeGameType: () => void;
};

export const GameActions = (
  contextsData: InitializeContextsFunctionType,
  gameActionCallbacks: GameActionCallbacksType
): GameActionsType => {
  const { removeRoomCodeId, getRoomCodeId } = useContextRoomCodeId(
    contextsData
  ) as UseRoomCodeIdHookType;
  const { removeGameId } = useContextGameId(contextsData) as UseGameIdHookType;
  const { logoutUser, getUser } = useContextUserSession(
    contextsData
  ) as UserSessionHookType;
  const { removeOpponentType } = useContextOpponentType(contextsData);

  const { onExitRoom, onLogout, onGameTypeChanged, exitGame } =
    gameActionCallbacks;

  const exitGameChanges = async () => {
    if (exitGame) {
      console.log("exitGame")
      exitGame();
    }
    removeGameContextsData(contextsData);
    if (isItRemoteGame(contextsData)) {
      await stopSubscribers();
      const room = getRoomCodeId();
      if (room) {
        await exitRoomFirebase(room);
      }
      removeGameId();
      removeRoomCodeId();
    }
    removeOpponentType(); // it makes sense to ask the user to select a new opponent,
  };

  const changeGameType = async () => {
    await exitGameChanges();

    document.querySelector('.main')?.remove();
    onGameTypeChanged();
  };

  const exitRoom = async () => {
    await exitGameChanges();

    document.querySelector('.main')?.remove();
    onExitRoom();
  };

  const logout = async () => {
    await unliveUser(getUser().id);

    await exitGameChanges();
    document.querySelector('.main')?.remove();

    logoutUser();
    onLogout();
  };

  return {
    exitRoom,
    logout,
    changeGameType,
  };
};

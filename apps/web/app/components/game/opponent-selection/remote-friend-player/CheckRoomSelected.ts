import {
  InitializeContextsFunctionType,
  UseAnotherPlayerHookType,
  useContextAnotherPlayer,
  useContextGameId,
  useContextGamePlayerType,
  useContextRoomCodeId,
  useContextUserSession,
  UseRoomCodeIdHookType,
} from '@contexts/index';
import { getRoomData } from '@firebase-dir/room';
import {
  FirebaseRoomType,
  GamePlayerType,
  RoomReadyResponseType,
  UserType,
} from '@types-dir/index';
import { RoomSelection } from './room-selection/RoomSelection';
import { addToRoot } from '@utils/index';
import { Layout } from '@components/layouts/layout/Layout';
import { isRoomReady } from '@utils/room';
import {
  GameActionCallbacksType,
  GameActions,
} from '@components/game/GameActions';
import { StartGame } from '@components/game/opponent-selection/remote-friend-player/StartGame';
import { RoomActiveSubscriber } from '@components/game/opponent-selection/remote-friend-player/RoomActiveSubscriber';
import { Loader } from '@components/base';

export type CheckRoomSelectedType = {
  startCheckRoomSelected: () => void;
};

export const CheckRoomSelected = (
  contextsData: InitializeContextsFunctionType,
  onLevelSelected: () => void,
  gameActions: GameActionCallbacksType
): CheckRoomSelectedType => {
  const { setAnotherPlayer } = useContextAnotherPlayer(
    contextsData
  ) as UseAnotherPlayerHookType;
  const { setRoomCodeId, removeRoomCodeId } = useContextRoomCodeId(
    contextsData
  ) as UseRoomCodeIdHookType;
  const { getUser } = useContextUserSession(contextsData);
  const { getGameId, hasGameId, removeGameId } = useContextGameId(contextsData);
  const { setPlayerType } = useContextGamePlayerType(contextsData);

  const { stopLoader, showLoader } = Loader();

  const startGameProcess = async () => {
    const { startProcess } = StartGame(
      contextsData,
      gameActions,
      onLevelSelected
    );
    await startProcess();
  };

  const joinGameProcess = async () => {
    const { joinGame } = StartGame(contextsData, gameActions, () => {
      stopLoader();
      onLevelSelected();
    });
    await joinGame();
  };

  const addRoomSubscriber = async (v: RoomReadyResponseType) => {
    const { checkRoomActive } = RoomActiveSubscriber(contextsData, gameActions);
    await checkRoomActive(v);
  };

  const onRoomSelected = async (v: RoomReadyResponseType) => {
    setRoomCodeId(v.roomCode);
    setAnotherPlayer(v.anotherPlayer);
    setPlayerType(v.playerType);
    await startGameProcess();
    await addRoomSubscriber(v);
  };

  const askRoomSelection = () => {
    const t = RoomSelection(contextsData, onRoomSelected);
    const f = t.render();
    if (f) {
      const gA = GameActions(contextsData, gameActions);
      addToRoot(Layout(f, gA));
    }
  };

  const roomDataPresentProcess = async (
    roomCode: string,
    roomData: FirebaseRoomType
  ) => {
    if (isRoomReady(roomData)) {
      // console.log("Room with data in session is at Firebase");
      const userId = getUser().id;
      const playerType: GamePlayerType =
        userId === roomData['creator'].id ? 'creator' : 'joiner';
      const anotherPlayer =
        playerType === 'creator'
          ? (roomData['joiner'] as UserType)
          : (roomData['creator'] as UserType);
      const roomReadyResponse = {
        roomCode,
        anotherPlayer,
        playerType,
      } as RoomReadyResponseType;
      setPlayerType(playerType);
      setAnotherPlayer(anotherPlayer);
      if (hasGameId() && getGameId()) {
        // console.log("Room with data in session has GameId ", roomCode, getGameId(), playerType);
        showLoader();
        await addRoomSubscriber(roomReadyResponse);
        await joinGameProcess();
      } else {
        // console.log("Room with data in session does not have GameId", roomCode, playerType);
        await startGameProcess();
      }
    } else {
      removeGameId();
      removeRoomCodeId();

      // console.log("Room with data in session is not at Firebase");
      askRoomSelection();
    }
  };

  const startCheckRoomSelected = async () => {
    const { hasRoomCodeId, getRoomCodeId } = useContextRoomCodeId(
      contextsData
    ) as UseRoomCodeIdHookType;
    if (hasRoomCodeId()) {
      const roomCode = getRoomCodeId();
      const roomData = await getRoomData(roomCode);
      if (roomData) {
        // check if room is having player and joiner online
        await roomDataPresentProcess(getRoomCodeId(), roomData);
      } else {
        // console.log("Room does not exist");
        removeGameId();
        removeRoomCodeId();
        askRoomSelection();
      }
    } else {
      // console.log('ROOM is not present', getRoomCodeId());
      askRoomSelection();
    }
  };

  return {
    startCheckRoomSelected,
  };
};

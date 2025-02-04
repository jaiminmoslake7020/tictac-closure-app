import {
  getRoomData,
  setCreatorIsInRoom,
  setJoinerIsInRoom,
} from '@firebase-dir/room';
import { isRoomReady } from '@utils/room';
import {
  GameActionCallbacksType,
  GameActions,
} from '@components/game/GameActions';
import {
  InitializeContextsFunctionType,
  useContextGamePlayerType,
  useContextRoomCodeId,
} from '@contexts/index';
import { ShowErrorMessageWrapper } from '@components/game/opponent-selection/remote-friend-player/ShowErrorMessageWrapper';

export type AddRoomSubscriberType = {
  checkRoomActive: () => void;
  checkRoomActiveSubscriber: () => void;
};

export const RoomActiveSubscriber = (
  contextsData: InitializeContextsFunctionType,
  gameActions: GameActionCallbacksType
): AddRoomSubscriberType => {
  let interval: NodeJS.Timeout;

  const { showErrorMessage } = ShowErrorMessageWrapper(
    contextsData,
    gameActions
  );

  const informServerAboutRoomPresence = async (roomCode: string) => {
    const { getPlayerType } = useContextGamePlayerType(contextsData);
    if (getPlayerType() === 'creator') {
      await setCreatorIsInRoom(roomCode);
    } else {
      await setJoinerIsInRoom(roomCode);
    }
  };

  const checkRoomReady = async (roomCode: string) => {
    const roomData = await getRoomData(roomCode);
    if (roomData) {
      if (isRoomReady(roomData)) {
        return true;
      } else {
        if (interval) {
          clearInterval(interval);
        }

        const g = GameActions(contextsData, gameActions);
        g.exitRoom();
        showErrorMessage('Room is left by another player.');
      }
    }
    return false;
  };

  // TODO: change in some kind of subscription where we can remove the listener
  const checkRoomActive = async () => {
    // console.log('checkRoomActive');
    const { getRoomCodeId } = useContextRoomCodeId(contextsData);
    const roomCode = getRoomCodeId();
    if (roomCode) {
      await informServerAboutRoomPresence(roomCode);
      return await checkRoomReady(roomCode);
    }
    return false;
  };

  // TODO: change in some kind of subscription where we can remove the listener
  const checkRoomActiveSubscriber = async () => {
    // console.log('checkRoomActiveSubscriber', gameActions.exitGame);
    const roomActive = await checkRoomActive();
    if (roomActive) {
      interval = setInterval(async () => {
        const roomActive = await checkRoomActive();
        if (!roomActive) {
          clearInterval(interval);
        }
      }, 10000);
    }
  };

  return {
    checkRoomActive,
    checkRoomActiveSubscriber,
  };
};

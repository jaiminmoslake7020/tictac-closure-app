import { RoomReadyResponseType } from '@types-dir/index';
import {
  getRoomData,
  setCreatorIsInRoom,
  setJoinerIsInRoom,
} from '@firebase-dir/room';
import { isRoomReady } from '@utils/room';
import {
  GameActionCallbacksType,
  GameActions,
  GameActionsType,
} from '@components/game/GameActions';
import {
  InitializeContextsFunctionType,
  useContextGamePlayerType,
  useContextRoomCodeId,
} from '@contexts/index';
import { AddErrorWithAction } from '@components/base/ux/notification/AddErrorWithAction';

export type AddRoomSubscriberType = {
  checkRoomActive: (roomReadyResponse: RoomReadyResponseType) => void;
};

export const RoomActiveSubscriber = (
  contextsData: InitializeContextsFunctionType,
  gameActions: GameActionCallbacksType,
): AddRoomSubscriberType => {
  let errorAdded = false;

  const showAlertRoomLeft = () => {
    // console.log('Room is left by another player');
    if (!errorAdded) {
      const gA = GameActions(contextsData, gameActions) as GameActionsType;
      AddErrorWithAction('Room is left by another player.', gA.exitRoom);
      errorAdded = true;
    } else {
      const gA = GameActions(contextsData, gameActions) as GameActionsType;
      gA.exitRoom();
    }
  };

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
      if (!isRoomReady(roomData)) {
        showAlertRoomLeft();
      }
    }
  };

  // TODO: change in some kind of subscription where we can remove the listener
  const checkRoomActive = async () => {
    // console.log('checkRoomActive');
    const { getRoomCodeId } = useContextRoomCodeId(contextsData);
    const roomCode = getRoomCodeId();
    if (roomCode) {
      await informServerAboutRoomPresence(roomCode);
      await checkRoomReady(roomCode);
      setTimeout(async () => {
        await checkRoomActive();
      }, 10000);
    } else {
      // console.log('roomCode empty');
    }
  };

  return {
    checkRoomActive,
  };
};

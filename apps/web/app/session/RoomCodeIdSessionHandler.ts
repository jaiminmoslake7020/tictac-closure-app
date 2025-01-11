import {getUser,} from './UserSessionHandler';
import {getSession, setSession} from './SessionHandler';

const RoomCodeIdSessionHandler = () => {

  const getRoomCodeId = () => {
    if (getUser()) {
      return getSession().roomCodeId;
    }
  }

  const setRoomCodeId = (roomCodeId: string) => {
    if (getUser()) {
      setSession({
        ...getSession(),
        roomCodeId
      });
    }
  }

  const removeRoomCodeId = () => {
    if (getUser()) {
      setSession({
        ...getSession(),
        roomCodeId: undefined,
        gameId: undefined,
        opponentType: undefined
      });
    }
  }

  return {
    getRoomCodeId,
    setRoomCodeId,
    removeRoomCodeId
  }
}

const {
  getRoomCodeId,
  setRoomCodeId,
  removeRoomCodeId
} = RoomCodeIdSessionHandler();

export {
  getRoomCodeId,
  setRoomCodeId,
  removeRoomCodeId
};

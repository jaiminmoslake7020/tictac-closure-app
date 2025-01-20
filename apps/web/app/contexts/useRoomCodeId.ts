import {
  setRoomCodeId as setRoomCodeIdSession,
  getRoomCodeId as getRoomCodeIdSession,
  removeRoomCodeId as removeRoomCodeIdSession,
} from '@session/index';

export type UseRoomCodeIdHookType = {
  getRoomCodeId: () => string;
  setRoomCodeId: (v: string) => void;
  hasRoomCodeId: () => boolean;
  removeRoomCodeId: () => void;
};

// hooks should be component based
export const useRoomCodeIdHook = (): UseRoomCodeIdHookType => {
  let roomCodeId: undefined | string;

  const setRoomCodeId = (item: string) => {
    setRoomCodeIdSession(item);
    roomCodeId = item;
  };

  const getRoomCodeId = (): string => {
    return roomCodeId as string;
  };

  const hasRoomCodeId = (): boolean => {
    if (roomCodeId) {
      return true;
    }
    const rV = getRoomCodeIdSession();
    if (rV) {
      roomCodeId = rV;
      return true;
    }
    return false;
  };

  const removeRoomCodeId = () => {
    roomCodeId = undefined;
    removeRoomCodeIdSession();
  };

  return {
    getRoomCodeId,
    setRoomCodeId,
    hasRoomCodeId,
    removeRoomCodeId,
  };
};

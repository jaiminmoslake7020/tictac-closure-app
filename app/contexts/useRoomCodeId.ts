export type UseRoomCodeIdHookType = {
  getRoomCodeId: () => string,
  setRoomCodeId: (v:string) => void,
};

// hooks should be component based
export const useRoomCodeIdHook = () :UseRoomCodeIdHookType => {
  let roomCodeId: undefined | string;

  const setRoomCodeId = (item: string) => {
    roomCodeId = item;
  }

  const getRoomCodeId = () : string => {
    return roomCodeId as string;
  }

  return {
    getRoomCodeId,
    setRoomCodeId
  }
}


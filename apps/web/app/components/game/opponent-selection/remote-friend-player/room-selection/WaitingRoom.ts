import { RoomReadyResponseType } from '@types-dir/index';
import { useDiv, useState } from '@components/base';
import { H2, Span } from '@components/base';
import { onRoomGotReady } from '@firebase-dir/room';

export const WaitingRoom = (
  roomCodeId: string,
  onRoomReady: (v: RoomReadyResponseType) => Promise<void>,
) => {
  const { getDiv, setDiv, removeDiv } = useDiv();

  const { getDiv: getDivOne, setDiv: setDivOne, removeDiv: removeDivOne } = useDiv();

  const { get, set, remove: removeState } = useState();

  const { get: get2, set: set2, remove: removeState2 } = useState();

  const render = () => {
    setDiv('loading-room');
    setDivOne('loading-room-icon');
    const h2 = H2('Waiting for your friend to join room! Room code is copied and ready to share!');
    set(h2);
    const span = Span('', 'fas fa-cog fa-spin');
    set2(span);
    getDivOne().append(get2());
    getDiv().append(get());
    getDiv().append(getDivOne());

    onRoomGotReady(roomCodeId, async (v: Partial<RoomReadyResponseType>) => {
      remove();
      await onRoomReady({
        ...v,
        playerType: 'creator',
      } as RoomReadyResponseType);
    });

    return getDiv();
  };

  const remove = () => {
    if (get()) {
      get().remove();
    }
    removeState();
    if (get2()) {
      get2().remove();
    }
    removeState2();
    removeDivOne();
    removeDiv();
  };

  return {
    render,
    remove,
  };
};

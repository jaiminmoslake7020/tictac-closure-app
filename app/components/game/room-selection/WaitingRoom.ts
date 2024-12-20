import {RoomReadyResponseType} from '../../../types';
import {useDiv, useState} from '../../base';
import {H2, Span} from '../../base';
import {listenToDocument} from '../../../firebase';

export const WaitingRoom = (roomCodeId: string, onRoomReady: (v: RoomReadyResponseType) => void) => {
  const {
    getDiv, setDiv, removeDiv
  } = useDiv();

  const {
    getDiv: getDivOne, setDiv: setDivOne, removeDiv: removeDivOne
  } = useDiv();

  const {
    get, set, remove: removeState
  } = useState();

  const {
    get: get2, set: set2, remove: removeState2
  } = useState();

  const render = () => {
    setDiv('loading-room');
    setDivOne('loading-room-icon');
    const h2 = H2('Waiting for your friend to join room!');
    set(h2);
    const span = Span('', 'fas fa-cog fa-spin');
    set2(span)
    getDivOne().append(get2());
    getDiv().append(get());
    getDiv().append(getDivOne());

    const unsubscribe = listenToDocument('rooms', roomCodeId, (d: any) => {
      if (d['creator'] && d['joiner'] && d['currentMove']) {
        remove();
        unsubscribe();
        console.log('unsubscribed', d);
        onRoomReady({
          roomCode: roomCodeId,
          anotherPlayer: d.joiner,
          currentMove: d['currentMove']
        });
      } else {
        console.log('d is not ready', d);
      }
    });

    return getDiv();
  }

  const remove = () => {
    if (get()) {
      get().remove();
    }
    removeState()
    if (get2()) {
      get2().remove();
    }
    removeState2();
    removeDivOne();
    removeDiv();
  }

  return {
    render,
    remove
  }
}


import {useDiv, useState} from '@components/base';
import {useButton} from '@components/base';
import {H2, P} from '@components/base';
import {copyTextToClipboard} from '@utils/index';

export type JoinRoomCopyButtonType = {
  render: () => HTMLDivElement,
  remove: () => void
};


export const JoinRoomCopyButton = (roomId: string, onRoomCodeCopied: () => void): JoinRoomCopyButtonType => {
  const {
    getDiv, setDiv, removeDiv
  } = useDiv();

  const {
    getDiv: getDiv2, setDiv: setDiv2, removeDiv: removeDiv2
  } = useDiv();

  const {
    getButton, setButton, removeButton
  } = useButton();

  const {
    get, set, remove: removeState
  } = useState();

  const {
    get: get2, set: set2, remove: removeState2
  } = useState();

  const render = () => {
    setDiv('join-room-text-group');
    setDiv2('join-room-copy-group');
    const p1 = H2('Please share this room code with your friend.', 'room-code-info');
    set2(p1);
    getDiv().append(get2())
    const p = P(roomId, 'room-code');
    set(p);
    getDiv2().append(get())
    setButton('Copy Room Code', 'btn inverse-btn join-btn', () => {
      copyTextToClipboard(roomId);
      remove();
      onRoomCodeCopied();
    });
    getDiv2().append(getButton());
    getDiv().append(getDiv2());
    return getDiv();
  }

  const remove = () => {
    if (get2()) {
      get2().remove();
    }
    if (get()) {
      get().remove();
    }
    removeState();
    removeState2();
    removeButton();
    removeDiv2();
    removeDiv();
  }

  return {
    render,
    remove
  };
}

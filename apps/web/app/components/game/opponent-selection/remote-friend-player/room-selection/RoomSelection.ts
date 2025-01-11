import {
  RoomObjectType,
  RoomReadyResponseType,
  UserType,
} from '@types-dir/index';
import { useDiv } from '@components/base';
import { useForm } from '@components/base';
import { History } from '@utils/index';
import { RoomSelectionItem, RoomSelectionItemType } from './RoomSelectionItem';
import { Loader } from '@components/base';
import { createRoom as createRoomFirebase } from '@firebase-dir/index';
import {
  InitializeContextsFunctionType,
  useContextUserSession,
} from '@contexts/index';
import { WaitingRoom } from './WaitingRoom';
import { JoinRoomInput } from './JoinRoomInput';
import { JoinRoomCopyButton } from './JoinRoomCopyButton';

export type RoomSelectionType = {
  render: () => HTMLDivElement;
  remove: () => void;
};

export const RoomSelection = (
  contextsData: InitializeContextsFunctionType,
  onRoomReady: (v: RoomReadyResponseType) => Promise<void>,
): RoomSelectionType => {
  const { getDiv, setDiv, removeDiv } = useDiv();

  const { getForm, setForm, removeForm } = useForm();

  const { getUser } = useContextUserSession(contextsData);

  const { pushState } = History();
  let roomFnArray = [] as RoomSelectionItemType[];
  const { showLoader, stopLoader } = Loader();

  const onFormSubmit = (e: any) => {
    e.preventDefault();
  };

  const roomItems = [
    {
      label: 'Create Room',
      value: 'create-room',
    },
    {
      label: 'Join Room',
      value: 'join-room',
    },
  ] as RoomObjectType[];

  const removeComponentForm = () => {
    roomFnArray.forEach((item) => {
      item.remove();
    });
    roomFnArray = [];
    removeForm();
  };

  const onRoomJoined = async (v: RoomReadyResponseType) => {
    removeDiv();
    await onRoomReady(v);
  };

  const joinRoom = async () => {
    removeComponentForm();
    const j = JoinRoomInput(contextsData, onRoomJoined);
    getDiv().append(j.render());
  };

  const onRoomCodeCopied = (roomCodeId: string) => {
    const w = WaitingRoom(roomCodeId, onRoomReady);
    getDiv().append(w.render());
  };

  const createRoom = async () => {
    removeComponentForm();
    showLoader();
    const user = getUser() as UserType;
    const roomCode = await createRoomFirebase(user);
    if (roomCode) {
      const j = JoinRoomCopyButton(
        roomCode,
        onRoomCodeCopied.bind(null, roomCode),
      );
      getDiv().append(j.render());
    } else {
      // TODO: add addError function which will call a toast
      console.error('Error creating room');
    }
    stopLoader();
  };

  const render = () => {
    setDiv('room-selection');
    setForm('room-selection-form', onFormSubmit, 'room-selection-form');

    roomItems.forEach(({ label, value }) => {
      const item1 = RoomSelectionItem(label, async () => {
        if (value === 'create-room') {
          await createRoom();
        } else {
          await joinRoom();
        }
      });
      roomFnArray.push(item1);
      getForm().append(item1.render());
    });

    getDiv().append(getForm());

    pushState('#/room-selection');
    return getDiv();
  };

  const remove = () => {
    roomFnArray.forEach((item) => {
      item.remove();
    });
    roomFnArray = [];
    removeForm();
    removeDiv();
  };

  return {
    render,
    remove,
  };
};

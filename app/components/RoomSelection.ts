import {RoomObjectType, RoomReadyResponseType, UserType} from '../types';
import {useDiv} from './base/Div';
import {useForm} from './base/Input';
import {History} from '../utils';
import {RoomSelectionItem, RoomSelectionItemType} from './RoomSelectionItem';
import {Loader} from './App';
import {getFirestoreObject} from '../firebase';
import {addDoc, collection} from 'firebase/firestore';
import {InitializeContextsFunctionType} from '../contexts';
import {WaitingRoom} from './WaitingRoom';
import {JoinRoomInput} from './JoinRoomInput';
import {JoinRoomCopyButton} from './JoinRoomCopyButton';

export type RoomSelectionType = {
  render: () => HTMLDivElement,
  remove: () => void
};


export const RoomSelection = (contextsData: InitializeContextsFunctionType, onRoomReady: (v: RoomReadyResponseType) => void): RoomSelectionType => {
  const {
    getDiv, setDiv, removeDiv
  } = useDiv();

  const {
    getForm, setForm, removeForm
  } = useForm();

  const {pushState} = History();
  let roomFnArray = [] as RoomSelectionItemType[];
  const {showLoader, stopLoader} = Loader();

  const onFormSubmit = (e: any) => {
    e.preventDefault();
  }

  const roomItems = [{
    label: 'Create Room',
    value: 'create-room'
  }, {
    label: 'Join Room',
    value: 'join-room'
  }] as RoomObjectType[];

  const removeComponentForm = () => {
    roomFnArray.forEach((item) => {
      item.remove();
    })
    roomFnArray = [];
    removeForm();
  }

  const onRoomJoined = (v: RoomReadyResponseType) => {
    removeDiv();
    onRoomReady(v);
  }

  const joinRoom = async () => {
    removeComponentForm();
    const j = JoinRoomInput(contextsData, onRoomJoined);
    getDiv().append(j.render());
  }

  const onRoomCodeCopied = (roomCodeId: string) => {
    const w = WaitingRoom(roomCodeId, onRoomReady);
    getDiv().append(w.render());
  }

  const createRoom = async () => {
    removeComponentForm();
    showLoader();
    const u = JSON.parse(localStorage.getItem('user') as string) as UserType;
    const f = getFirestoreObject();
    const roomCollection = collection(f, 'rooms');
    let roomDoc = await addDoc(roomCollection, {
      creator: u
    });
    const t = {
      id: roomDoc.id,
    }
    localStorage.setItem('currentRoom', JSON.stringify(t));
    const j = JoinRoomCopyButton(roomDoc.id, onRoomCodeCopied.bind(null, roomDoc.id));
    getDiv().append(j.render());
    stopLoader();
  }

  const render = () => {
    setDiv('room-selection');
    setForm('room-selection-form', onFormSubmit, 'room-selection-form');

    roomItems.forEach(({label, value}) => {
      const item1 = RoomSelectionItem(label, async () => {
        if (value === "create-room") {
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
  }

  const remove = () => {
    roomFnArray.forEach((item) => {
      item.remove();
    })
    roomFnArray = [];
    removeForm();
    removeDiv();
  }

  return {
    render,
    remove
  };
}
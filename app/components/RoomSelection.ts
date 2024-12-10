import {RoomType, RoomObjectType, UserType, RoomReadyResponseType} from '../types';
import {useDiv, useState} from './base/Div';
import {Label, TextInput, useForm, useTextInput} from './base/Input';
import {getRandomInt, History} from '../utils';
import {RoomSelectionItem, RoomSelectionItemType} from './RoomSelectionItem';
import {Loader} from './App';
import {getFirestoreObject, listenToDocument} from '../firebase';
import {addDoc, collection, doc, getDoc, onSnapshot, updateDoc} from 'firebase/firestore';
import {useButton} from './base/Button';
import {H2, P, Span} from './base/Text';

export type RoomSelectionType = {
  render : () => HTMLDivElement,
  remove : () => void
};

export type JoinRoomInputType = {
  render : () => HTMLDivElement,
  remove : () => void
};

function copyTextToClipboard(text:string) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
    });
}

export const WaitingRoom = (roomCodeId: string, onRoomReady: (v:RoomReadyResponseType) => void)  => {
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

    const unsubscribe = listenToDocument('rooms', roomCodeId, (d:any) => {
      if (d['creator'] && d['joiner'] && d['currentMove']) {
        remove();
        unsubscribe();
        console.log('unsubscribed', d);
        onRoomReady({
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



export const JoinRoomInput = (onRoomReady: (v:RoomReadyResponseType) => void) :JoinRoomInputType => {
  const {
    getDiv, setDiv, removeDiv
  } = useDiv();
  const {
    getDiv: getDivOne, setDiv: setDivOne, removeDiv: removeDivOne
  } = useDiv();
  const {
    getDiv: getDivTwo, setDiv: setDivTwo, removeDiv: removeDivTwo
  } = useDiv();
  const {
    getInput, setInput, removeInput
  } = useTextInput();
  const {
    get, set, remove: removeState
  } = useState();
  const {
    get:get2, set: set2, remove: removeState2
  } = useState();
  const {
    get:get3, set: set3, remove: removeState3
  } = useState();
  const {
   getButton, setButton, removeButton
  } = useButton();

  const { showLoader, stopLoader } = Loader();

  const resetErrorState = () => {
    get3().innerText = '';
    getDivOne().classList.remove('input-error');
  }

  const validateCode = async () => {
    resetErrorState();

    const roomCode = getInput().value;
    if (roomCode.length > 0) {

      showLoader();
      const f = getFirestoreObject();
      const roomCollection = collection(f, 'rooms');
      const docRef = doc(f, 'rooms', roomCode);
      const docSnap  = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data['creator'] && !data['joiner']) {
          console.log("Document data:", data); // Retrieve the document data

          const idArray = [data['creator'] as UserType, JSON.parse(localStorage.getItem('user') as string) as UserType] as UserType[];
          const number = getRandomInt(0, 1);
          const currentMove = idArray[number].id;
          const updatedDocData = {
            joiner: JSON.parse(localStorage.getItem('user') as string) as UserType,
            currentMove
          };
          await updateDoc(docRef,updatedDocData);
          remove();
          stopLoader();

          onRoomReady({
            anotherPlayer: JSON.parse(localStorage.getItem('user') as string) as UserType,
            currentMove
          } as RoomReadyResponseType);

        } else {
          get3().innerText = 'Please input correct code.';
          getDivOne().classList.add('input-error');
          stopLoader();
        }
      } else {
        get3().innerText = 'Please input correct code.';
        getDivOne().classList.add('input-error');
        stopLoader();
      }
    } else {
      get3().innerText = 'Please input correct code.';
      getDivOne().classList.add('input-error');
    }
  }

  const render = () => {
    setDiv('join-room-input-group');

    const h2 = H2('Please use the code your friend shared with you.');
    set(h2);

    setDivTwo('flex justify-end w-full');
    setButton('Join', 'btn w-fit', validateCode);
    getDivTwo().append(getButton())

    setDivOne('input-group');
    const l = Label('input-group-label');
    l.innerText = 'Room Code';
    set2(l);
    setInput('join-room-text-input','', 'join-room-text-input', 'text-input');
    const s = Span('','input-group-span');
    set3(s);
    getDivOne().append(get2());
    getDivOne().append(getInput());
    getDivOne().append(get3());

    getDiv().append(get());
    getDiv().append(getDivOne());
    getDiv().append(getDivTwo());

    return getDiv();
  }

  const remove = () => {
    if (get()) {
      get().remove();
    }
    removeState();

    if (get2()) {
      get2().remove();
    }
    removeState2();

    if (get3()) {
      get3().remove();
    }
    removeState3();

    removeInput();
    removeDivOne();
    removeButton();
    removeDivTwo();
    removeDiv();
  }

  return {
    render,
    remove
  };
}

export const JoinRoomCopyButton = (roomId:string, onRoomCodeCopied: () => void) :JoinRoomInputType => {
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
    setButton('Copy Room Code', 'btn inverse-btn join-btn', (e) => {
      copyTextToClipboard( roomId );
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

export const RoomSelection = (onRoomReady: (v:RoomReadyResponseType) => void) :RoomSelectionType => {
  const {
    getDiv, setDiv, removeDiv
  } = useDiv();

  const {
    getForm, setForm, removeForm
  } = useForm();

  const { pushState } = History();
  let roomFnArray = [] as RoomSelectionItemType[];
  const { showLoader, stopLoader } = Loader();

  const onFormSubmit = (e:any) => {
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

  const joinRoom = async () => {
    removeComponentForm();
    const j = JoinRoomInput((v:RoomReadyResponseType) => {
      removeDiv();
      onRoomReady(v);
    });
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
    let roomDoc = await addDoc(roomCollection,{
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

    roomItems.forEach(({label,value}) => {
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

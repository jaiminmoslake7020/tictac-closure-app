import {InitializeContextsFunctionType, useContextUserSession} from '@contexts/index';
import {RoomReadyResponseType, UserType} from '@types-dir/index';
import {useDiv, useState} from '@components/base';
import {Label, useTextInput} from '@components/base';
import {useButton} from '@components/base';
import {Loader} from '@components/base';
import {joinRoom, roomData} from '@firebase-dir/index';
import {getRandomInt} from '@utils/index';
import {H2, Span} from '@components/base';

export type JoinRoomInputType = {
  render: () => HTMLDivElement,
  remove: () => void
};

export const JoinRoomInput = (contextsData: InitializeContextsFunctionType, onRoomReady: (v: RoomReadyResponseType) => void): JoinRoomInputType => {

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
    get: get2, set: set2, remove: removeState2
  } = useState();
  const {
    get: get3, set: set3, remove: removeState3
  } = useState();
  const {
    getButton, setButton, removeButton
  } = useButton();

  const {showLoader, stopLoader} = Loader();

  const resetErrorState = () => {
    get3().innerText = '';
    getDivOne().classList.remove('input-error');
  }

  const validateCode = async () => {
    resetErrorState();

    const roomCode = getInput().value;
    if (roomCode.length > 0) {

      showLoader();
      const docSnap = await roomData(roomCode);
      if (docSnap.exists()) {
        const data  = docSnap.data() as {
          'creator': UserType,
          'joiner'?: UserType
        };
        if (data['creator'] && !data['joiner']) {
          // console.log("Document data:", data); // Retrieve the document data

          const {
            getUser
          } = useContextUserSession(contextsData);
          const userItem = getUser() as UserType;
          const idArray = [data['creator'] as UserType, userItem] as UserType[];
          const number = getRandomInt(0, 1);
          const currentMove = idArray[number].id;
          const updatedDocData = {
            joiner: userItem,
            currentMove
          };
          await joinRoom(roomCode, updatedDocData);
          remove();
          stopLoader();

          onRoomReady({
            roomCode: roomCode,
            anotherPlayer: data['creator'] as UserType,
            currentMove
          });

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
    setInput('join-room-text-input', '', 'join-room-text-input', 'text-input');
    const s = Span('', 'input-group-span');
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

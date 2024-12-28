import {InitializeContextsFunctionType, useContextUserSession} from '@contexts/index';
import {Label, Loader, useDiv, useSpan, useState, useTextInput} from '@components/base';
import {addUser} from '@firebase-dir/index';
import {ButtonGroup} from './ButtonGroup';

export const User = (contextsData: InitializeContextsFunctionType, initGame: () => void) => {
  const {
    setUser, checkUserExists
  } = useContextUserSession(contextsData);

  const {getDiv: getUserDiv, setDiv: setUserDiv, removeDiv} = useDiv();
  const {getDiv: getUserInputContainerDiv, setDiv: setUserInputContainerDiv, removeDiv: removeDiv1} = useDiv();
  const {getInput, setInput, removeInput} = useTextInput();
  const {getSpan, setSpan, removeSpan} = useSpan();
  const {showLoader, stopLoader} = Loader();
  const {get, set} = useState();

  const remove = () => {
    const btn = get();
    btn.remove();
    removeSpan();
    removeInput();
    removeDiv1();
    removeDiv();
  }

  const btnClick = async () => {
    const v = getInput().value;
    if (v.length >= 3) {
      showLoader();
      getUserInputContainerDiv().classList.remove('input-error');
      getSpan().innerText = '';
      const userDoc = await addUser(v);
      if (userDoc) {
        const t = {
          id: userDoc?.id,
          username: v
        }
        setUser(t);
        remove();
        stopLoader();
        initGame();
      } else {
        remove();
        stopLoader();
        // TODO: call addError function here to show error message
        console.log("Error adding user");
      }
    } else {
      getUserInputContainerDiv().classList.add('input-error');
      getSpan().innerText = 'Name should be at least 3 characters long.';
    }
  }

  const render = () => {
    const userJson = checkUserExists();
    if (userJson) {
      console.log("USER EXISTS");
      // console.log("userJson", userJson);
      return undefined;
    } else {
      setUserDiv('user-div-container');
      setUserInputContainerDiv('user-div-input-container input-group');
      const l = Label();
      l.innerText = 'Your Name';
      setInput('username', '', 'username', 'text-input');
      getUserInputContainerDiv().append(l);
      getUserInputContainerDiv().append(getInput());
      setSpan('input-group-span');
      getUserInputContainerDiv().append(getSpan());
      const b = ButtonGroup(btnClick);
      set(b);
      getUserInputContainerDiv().append(b.render());
      getUserDiv().append(getUserInputContainerDiv());
      window.history.pushState(null, 'undefined', '#/user');
      return getUserDiv();
    }
  }

  return {
    render
  }
}


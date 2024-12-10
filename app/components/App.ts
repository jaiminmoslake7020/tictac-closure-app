import {appendEl} from '../utils';
import {useDiv, useState} from './base/Div';
import {Label, useTextInput} from './base/Input';
import {useButton} from './base/Button';
import {useSpan} from './base/Text';
import {addDoc, collection, doc, getDoc, updateDoc, getFirestore, onSnapshot, setDoc} from 'firebase/firestore';
import {getFirestoreObject} from '../firebase';
import {Game} from './Game';
import {UserType} from '../types';

export const ButtonGroup = (btnClick: () => void) => {
  const {getDiv: getUserDiv, setDiv: setUserDiv, removeDiv} = useDiv();
  const {getButton, setButton, removeButton} = useButton();

  const render = () => {
    setUserDiv('user-btn-group');
    setButton('Play Game', 'btn btn-user-page', btnClick);
    getUserDiv().append( getButton() );
    return getUserDiv();
  }

  const remove = () => {
    removeButton();
    removeDiv();
  }

  return {
    render,
    remove
  }
}

export const Loader = () => {
  const {getDiv, setDiv, removeDiv} = useDiv();
  const {getDiv: getDivOne, setDiv: setDivOne, removeDiv:removeDivOne } = useDiv();
  const {getSpan, setSpan, removeSpan} = useSpan();

  const render = () => {
    setDiv('loading-wrapper');
    setDivOne('loading-wrapper-child');
    setSpan('loading-text fas fa-cog animate-spin  ');
    getDivOne().append(getSpan());
    getDiv().append(getDivOne());
    return getDiv();
  }

  const showLoader = () => {
    const d = render();
    appendEl('#root', d);
  }

  const stopLoader = () => {
    removeSpan();
    removeDivOne();
    removeDiv();
  }

  return {
    showLoader,
    stopLoader
  }
}

export const User = (setUser: (u:UserType) => void) => {
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

      const f = getFirestoreObject();
      const userCollection = collection(f, 'users');
      let userDoc = await addDoc(userCollection,{
        username: v
      });
      const t = {
        id: userDoc.id,
        username: v
      }
      localStorage.setItem('user', JSON.stringify(t));

      remove();
      stopLoader();
      setUser(t);
    } else {
      getUserInputContainerDiv().classList.add('input-error');
      getSpan().innerText = 'Name should be at least 3 characters long.';
    }
  }

  const render = () => {
    const userJson  = localStorage.getItem('user');
    if (userJson !== null) {
      console.log("userJson", userJson);
      return undefined;
    } else {
      setUserDiv('user-div-container');
      setUserInputContainerDiv('user-div-input-container input-group');
      const l = Label();
      l.innerText = 'Your Name';
      setInput('username','', 'username','text-input');
      getUserInputContainerDiv().append(l);
      getUserInputContainerDiv().append(getInput());
      setSpan('input-group-span');
      getUserInputContainerDiv().append(getSpan());
      const b = ButtonGroup(btnClick);
      set(b);
      getUserInputContainerDiv().append( b.render() );
      getUserDiv().append( getUserInputContainerDiv() );
      window.history.pushState(null, 'undefined', '#/user');
      return getUserDiv();
    }
  }

  return {
    render
  }
}

export const keepSessionAlive = async () => {
  const u = JSON.parse(localStorage.getItem('user') as string) as UserType;
  if (u.id) {
    const f = getFirestoreObject();
    const docRef = doc(f, 'users', u.id);
    await updateDoc(docRef, {
      live: (new Date()).getTime()
    });
  }
}

export const keepSessionAliveInterval = async () => {
  await keepSessionAlive();
  setInterval(await keepSessionAlive , 15000);
}

export const App = () => {

  const setUser = (u: UserType) => {
    console.log('u', u);
    initGame();
  }

  const initGame = () => {
    const t = Game();
    t.init();
  }

  const init = () => {
    const t = User(setUser);
    const f = t.render();
    if ( f ) {
      appendEl('#root', f);
    } else {
      // keepSessionAliveInterval();
      initGame();
    }
  }

  return {
    init
  }
}

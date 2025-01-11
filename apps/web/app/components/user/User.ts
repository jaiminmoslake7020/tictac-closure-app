import {
  InitializeContextsFunctionType,
  useContextUserSession,
} from '@contexts/index';
import { Loader, useDiv, useState } from '@components/base';
import { ButtonGroup } from './ButtonGroup';
import { User as Usertype } from '@firebase/auth';
import { upsertUser } from '@firebase-dir/user';

export const User = (
  contextsData: InitializeContextsFunctionType,
  initGame: () => void,
) => {
  const { setUser, checkUserExists } = useContextUserSession(contextsData);

  const { getDiv: getUserDiv, setDiv: setUserDiv, removeDiv } = useDiv();
  const { showLoader, stopLoader } = Loader();
  const { get, set } = useState();

  const remove = () => {
    const btn = get();
    btn.remove();
    removeDiv();
  };

  const btnClick = async (user: Usertype) => {
    showLoader();
    const userDoc = await upsertUser(user);
    if (userDoc && userDoc.uid) {
      const t = {
        id: userDoc?.uid,
        username:
          userDoc?.email?.split('@')[0] || userDoc?.displayName || 'Anonymous',
      };
      setUser(t);
      remove();
      stopLoader();
      initGame();
    } else {
      remove();
      stopLoader();
      // TODO: call addError function here to show error message
      // console.log("Error upserting user");
    }
  };

  const render = () => {
    const userJson = checkUserExists();
    if (userJson) {
      // console.log("USER EXISTS");
      // console.log("userJson", userJson);
      return undefined;
    } else {
      setUserDiv('user-div-container main-wrapper');
      const b = ButtonGroup(btnClick);
      set(b);
      getUserDiv().append(get().render());
      window.history.pushState(null, 'undefined', '#/user');
      return getUserDiv();
    }
  };

  return {
    render,
  };
};

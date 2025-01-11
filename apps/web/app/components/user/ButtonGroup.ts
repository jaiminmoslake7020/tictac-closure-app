import { useButton, useDiv } from '@components/base';
import { showGoogleSignInPopup } from '@firebase-dir/signin';
import { User } from '@firebase/auth';

export const ButtonGroup = (btnClick: (user: User) => void) => {
  const { getDiv: getUserDiv, setDiv: setUserDiv, removeDiv } = useDiv();
  const { getButton, setButton, removeButton } = useButton();

  const render = () => {
    setUserDiv('user-btn-group main-content-wrapper');
    setButton('Google Sign In', 'btn btn-user-page', async () => {
      const user = await showGoogleSignInPopup();
      btnClick(user);
    });
    getUserDiv().append(getButton());
    return getUserDiv();
  };

  const remove = () => {
    removeButton();
    removeDiv();
  };

  return {
    render,
    remove,
  };
};

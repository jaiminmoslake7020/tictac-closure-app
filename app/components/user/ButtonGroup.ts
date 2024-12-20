import {useButton, useDiv} from '../base';

export const ButtonGroup = (btnClick: () => void) => {
  const {getDiv: getUserDiv, setDiv: setUserDiv, removeDiv} = useDiv();
  const {getButton, setButton, removeButton} = useButton();

  const render = () => {
    setUserDiv('user-btn-group');
    setButton('Play Game', 'btn btn-user-page', btnClick);
    getUserDiv().append(getButton());
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

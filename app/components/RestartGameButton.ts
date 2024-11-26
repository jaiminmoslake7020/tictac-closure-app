import {useButton} from './base/Button';

let reloadTime = 20;

export type RestartGameButtonControllerType = {
  getButtonEnabled: () => boolean,
  setButtonEnabled: (v: boolean) => void
};

const RestartGameButtonController = () : RestartGameButtonControllerType => {
  let buttonEnabled = true;

  const getButtonEnabled = () => buttonEnabled

  const setButtonEnabled = (item:boolean) => {
    if (item) {
      console.log('Auto Restart is turned on')
    } else {
      console.log('Auto Restart is turned off')
    }
    buttonEnabled = item;
  }

  return {
    getButtonEnabled,
    setButtonEnabled
  }
};

export type RestartGameButtonType = RestartGameButtonControllerType & {
  render: () => HTMLButtonElement,
  remove: () => void,
  changeRestartButtonText: (reload: Function, time: number) => void
};

export const RestartGameButton = ( reload: Function ) : RestartGameButtonType  => {
  const { getButton, setButton } = useButton();

  const { setButtonEnabled, getButtonEnabled } = RestartGameButtonController();

  const changeRestartButtonText = (reload : Function, time: number) => {
    if (getButtonEnabled()) {
      if (time === 0) {
        setButtonEnabled( false );
        reload();
      } else {
        getButton().innerHTML = 'Reload - '+time+'s';
        setTimeout(changeRestartButtonText, 1000, reload, time - 1);
      }
    }
  }

  const render = () => {
    setButtonEnabled( true );
    setButton('Reload - '+reloadTime+'s', ' btn btn-reload btn-animate ', () => {
      setButtonEnabled( false );
      reload();
    });
    setTimeout(changeRestartButtonText, 1000, reload, reloadTime - 1);
    return getButton();
  }

  const remove = () => {
    getButton().remove();
  }

  return {
    setButtonEnabled,
    getButtonEnabled,
    render,
    remove,
    changeRestartButtonText
  }
}

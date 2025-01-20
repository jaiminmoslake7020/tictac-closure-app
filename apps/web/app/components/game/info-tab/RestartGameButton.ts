import { useButton } from '@components/base';
import { GamePlayerType } from '@types-dir/index';

const reloadTime = 20;

export type RestartGameButtonControllerType = {
  getButtonEnabled: () => boolean;
  setButtonEnabled: (v: boolean) => void;
};

const RestartGameButtonController = (): RestartGameButtonControllerType => {
  let buttonEnabled = true;

  const getButtonEnabled = () => buttonEnabled;

  const setButtonEnabled = (item: boolean) => {
    buttonEnabled = item;
  };

  return {
    getButtonEnabled,
    setButtonEnabled,
  };
};

export type RestartGameButtonType = RestartGameButtonControllerType & {
  render: () => HTMLButtonElement;
  remove: () => void;
  changeRestartButtonText: (reload: Function, time: number) => void;
};

export const RestartGameButton = (
  reload: Function,
  playerType: GamePlayerType,
): RestartGameButtonType => {
  const { getButton, setButton } = useButton();

  const { setButtonEnabled, getButtonEnabled } = RestartGameButtonController();
  // we are adding 2 seconds delay for joiner to join the game before ite becomes creator
  const timeOut = playerType === 'creator' ? 1000 : 1100;

  const changeRestartButtonText = (reload: Function, time: number) => {
    if (getButtonEnabled()) {
      if (time === 0) {
        setButtonEnabled(false);
        reload();
      } else {
        getButton().innerHTML = 'Reload - ' + time + 's';
        setTimeout(changeRestartButtonText, timeOut, reload, time - 1);
      }
    }
  };

  const render = () => {
    setButtonEnabled(true);
    setButton('Reload - ' + reloadTime + 's', ' btn btn-reload btn-animate ', () => {
      setButtonEnabled(false);
      reload();
    });
    setTimeout(changeRestartButtonText, 1000, reload, reloadTime - 1);
    return getButton();
  };

  const remove = () => {
    getButton().remove();
  };

  return {
    setButtonEnabled,
    getButtonEnabled,
    render,
    remove,
    changeRestartButtonText,
  };
};

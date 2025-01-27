import { useButton, useDiv, useState } from '@components/base';

export type ButtonItemType = {
  render: () => HTMLButtonElement;
  remove: () => void;
};

export const ButtonItem = (
  btnLabel: string,
  btnClassList: string,
  onClick: EventListenerOrEventListenerObject
): ButtonItemType => {
  const { getButton, setButton, removeButton } = useButton();

  const render = () => {
    setButton(btnLabel, btnClassList, onClick);
    return getButton();
  };

  const remove = () => {
    removeButton();
  };

  return {
    render,
    remove,
  };
};

export const RemoteRandomRestartDisplay = (
  onClick: EventListenerOrEventListenerObject,
  changeGameType: EventListenerOrEventListenerObject
) => {
  const { getDiv, setDiv, removeDiv } = useDiv();

  const {
    getDiv: getDivOne,
    setDiv: setDivOne,
    removeDiv: removeDivOne,
  } = useDiv();

  const {
    get,
    set,
    remove: removeState,
  } = useState() as {
    get: () => ButtonItemType[];
    set: (value: ButtonItemType[]) => void;
    remove: () => void;
  };

  const render = () => {
    setDiv('remote-random-restart-display');
    setDivOne('buttons-wrapper');

    const b1 = ButtonItem(
      'Restart Game With Remote Player',
      'btn btn-primary',
      onClick
    );
    const b2 = ButtonItem(
      'Change Game Type',
      'btn btn-primary',
      changeGameType
    );

    getDivOne().append(b1.render());
    getDivOne().append(b2.render());
    set([b1, b2]);

    getDiv().append(getDivOne());
    return getDiv();
  };

  const remove = () => {
    get().forEach((b) => b.remove());
    removeState();
    removeDivOne();
    removeDiv();
  };

  return {
    render,
    remove,
  };
};

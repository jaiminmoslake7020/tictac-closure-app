import { applyClassList, createEL } from '@utils/index';
import { useSpan } from '@components/base';

export const Button = (
  btnLabel: string,
  btnClassList: string,
  onClick: EventListenerOrEventListenerObject,
): HTMLButtonElement => {
  let button = createEL('button') as HTMLButtonElement;
  if (btnClassList !== '') {
    btnClassList = 'btn ' + btnClassList;
    button = applyClassList(button, btnClassList);
  } else {
    button = applyClassList(button, 'btn');
  }
  button.setAttribute('type', 'button');
  button.addEventListener('click', onClick);
  button.innerHTML = btnLabel;
  return button;
};

export const IconButton = (
  btnLabel: string,
  btnClassList: string,
  icon: string,
  onClick: EventListenerOrEventListenerObject,
): HTMLButtonElement => {
  let button = Button(
    '',
    btnClassList + ' btn-icon ',
    onClick,
  ) as HTMLButtonElement;

  const { getSpan, setSpan } = useSpan();
  setSpan('');
  getSpan().innerText = btnLabel;

  const { getSpan: getSpanOne, setSpan: setSpanOne } = useSpan();
  setSpanOne(icon);

  button.append(getSpanOne());
  button.append(getSpan());

  return button;
};

export type useButtonType = {
  getButton: () => HTMLButtonElement;
  setButton: (
    btnLabel: string,
    btnClassList: string,
    onClick: EventListenerOrEventListenerObject,
  ) => void;
  removeButton: () => void;
};

export const useButton = (): useButtonType => {
  let button: undefined | HTMLButtonElement;

  const getButton = () => {
    return button as HTMLButtonElement;
  };

  const setButton = (
    btnLabel: string,
    btnClassList: string,
    onClick: EventListenerOrEventListenerObject,
  ) => {
    button = Button(btnLabel, btnClassList, onClick);
  };

  const removeButton = () => {
    if (getButton()) {
      (getButton() as HTMLButtonElement).remove();
    }
    button = undefined;
  };

  return {
    getButton,
    setButton,
    removeButton,
  };
};

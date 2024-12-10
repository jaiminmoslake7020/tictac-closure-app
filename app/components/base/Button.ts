import {applyClassList, createEL} from '../../utils';

export const Button = (btnLabel: string, btnClassList: string, onClick: EventListenerOrEventListenerObject) : HTMLButtonElement => {
  let button = createEL('button') as HTMLButtonElement;
  button = applyClassList(button, btnClassList);
  button.setAttribute('type', 'button');
  button.addEventListener('click', onClick );
  button.innerHTML = btnLabel;
  return button;
}

export type useButtonType = {
  getButton: () => HTMLButtonElement,
  setButton: (btnLabel: string, btnClassList: string, onClick: EventListenerOrEventListenerObject) => void,
  removeButton: () => void
};

export const useButton = () : useButtonType => {
  let button : undefined | HTMLButtonElement;

  const getButton = () => {
    return button as HTMLButtonElement;
  }

  const setButton = (btnLabel: string, btnClassList: string, onClick: EventListenerOrEventListenerObject) => {
    button = Button(btnLabel, btnClassList, onClick);
  }

  const removeButton = () => {
    if (getButton()) {
      (getButton() as HTMLButtonElement).remove()
    }
    button = undefined
  }

  return {
    getButton,
    setButton,
    removeButton
  }
}

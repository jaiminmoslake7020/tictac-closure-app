import {useDiv, useState} from '@components/base';
import {IconButton} from '@components/base/html/Button';

export type NavLinkType = {
  render: () => HTMLDivElement,
  getBtn: () => HTMLButtonElement
}

export const NavLink = (label: string, icon: string, onClick: () => void) => {
  const {
    getDiv, setDiv
  } = useDiv();

  const {
    get: getBtn, set: setBtn
  } = useState() as {
    get: () => HTMLButtonElement,
    set: (v: HTMLButtonElement) => void
  };

  setBtn(IconButton(label, ' btn ', icon, onClick));

  const render = () => {
    setDiv('nav-link');
    getDiv().append(getBtn());
    return getDiv();
  }

  return {
    render,
    getBtn
  }
}

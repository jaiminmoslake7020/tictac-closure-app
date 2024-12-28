import {useDiv} from '@components/base';
import {IconButton} from '@components/base/html/Button';

export const NavLink = (label: string, icon: string, onClick: () => void) => {
  const {
    getDiv, setDiv
  } = useDiv();

  const render = () => {
    setDiv('nav-link');
    const ib = IconButton(label, ' btn ', icon, onClick);
    getDiv().append(ib);
    return getDiv();
  }

  return {
    render
  }
}

import { useDiv } from '@components/base';
import { NavBar } from '@components/layouts/navbar/NavBar';
import { IconButton } from '@components/base/html/Button';
import { GameActionsType } from '@components/game/GameActions';

export const Sidebar = (gameActions: GameActionsType) => {
  const { getDiv, setDiv } = useDiv();
  const { getDiv: getDivOne, setDiv: setDivOne } = useDiv();

  const { getDiv: getDivTwo, setDiv: setDivTwo } = useDiv();

  const showSidebar = () => {
    getDiv().classList.add('open');
  };

  const hideSidebar = () => {
    getDiv().classList.remove('open');
  };

  const render = () => {
    setDiv('sidebar-wrapper');
    setDivOne('sidebar');

    setDivTwo('cls-btn-wrapper');
    const n1 = IconButton('', 'close-sidebar-btn cls-btn btn ', 'fa-solid fa-times', hideSidebar);
    const n2 = IconButton('', 'show-sidebar-btn cls-btn btn ', 'fa-solid fa-bars', showSidebar);
    getDivTwo().append(n1);
    getDivTwo().append(n2);

    getDivOne().append(getDivTwo());

    const n = NavBar(gameActions);
    getDivOne().append(n.render());

    getDiv().append(getDivOne());
    return getDiv();
  };

  return {
    render,
  };
};

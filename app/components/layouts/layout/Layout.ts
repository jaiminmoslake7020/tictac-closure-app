import {useDiv} from '@components/base';
import {Header} from '@components/layouts/header/Header';
import {Sidebar} from '@components/layouts/sidebar/Sidebar';
import {GameActionsType} from '@types-dir/index';

export const Layout = (d:HTMLElement, gameActions: GameActionsType) => {
  const {
    getDiv, setDiv
  } = useDiv();
  const {
    getDiv: getDivOne, setDiv: setDivOne
  } = useDiv();

  setDiv('main-wrapper');
  const h = Header(gameActions);
  getDiv().append(h.render());

  const s = Sidebar(gameActions);
  getDiv().append(s.render());

  setDivOne('main-content-wrapper');
  getDivOne().append(d);

  getDiv().append(getDivOne())
  return getDiv();

  return getDiv();
}

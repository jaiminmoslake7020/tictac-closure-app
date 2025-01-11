import {useDiv} from '@components/base';
import {Header} from '@components/layouts/header/Header';
import {Sidebar} from '@components/layouts/sidebar/Sidebar';
import {NotificationWrapper} from '@components/base/ux/notification/NotificationWrapper';
import {GameActionsType} from '@components/game/GameActions';

export const Layout = (d:HTMLElement, gameActions: GameActionsType) => {
  const {
    getDiv, setDiv
  } = useDiv();
  const {
    getDiv: getDivOne, setDiv: setDivOne
  } = useDiv();

  const nW = NotificationWrapper();

  setDiv('main-wrapper');
  const h = Header(gameActions);
  getDiv().append(h.render());

  const s = Sidebar(gameActions);
  getDiv().append(s.render());

  setDivOne('main-content-wrapper');
  getDivOne().append(d);

  getDiv().append(nW.render());

  getDiv().append(getDivOne())
  return getDiv();

  return getDiv();
}

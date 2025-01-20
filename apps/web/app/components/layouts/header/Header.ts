import { H2, useDiv } from '@components/base';
import { NavBar } from '@components/layouts/navbar/NavBar';
import { GameActionsType } from '@components/game/GameActions';
import { getUser } from '@session/UserSessionHandler';

export const Header = (gameActions: GameActionsType) => {
  const { getDiv, setDiv } = useDiv();
  const { getDiv: getDivOne, setDiv: setDivOne } = useDiv();
  const { getDiv: getDivTwo, setDiv: setDivTwo } = useDiv();

  const render = () => {
    setDiv('header-wrapper');
    setDivOne('header');

    const u = getUser();
    if (u && u.username) {
      setDivTwo('header-content');
      getDivTwo().append(H2(`HI ${u.username}`));
      getDivOne().append(getDivTwo());
    }

    const n = NavBar(gameActions);
    getDivOne().append(n.render());

    getDiv().append(getDivOne());
    return getDiv();
  };

  return {
    render,
  };
};

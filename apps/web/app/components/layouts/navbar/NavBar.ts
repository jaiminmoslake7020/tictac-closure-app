import { useDiv } from '@components/base';
import { NavLink } from '@components/base/ux/NavLink';
import { getOpponentType, getRoomCodeId, getUser } from '@session/index';
import { GameActionsType } from '@components/game/GameActions';
import { opponentTypesObject } from '@data/index';

export const NavBar = (gameActions: GameActionsType) => {
  const { getDiv, setDiv } = useDiv();
  const { getDiv: getDivOne, setDiv: setDivOne } = useDiv();

  const render = () => {
    setDiv('navbar-wrapper');
    setDivOne('navbar');

    const user = getUser();
    const roomCodeId = getRoomCodeId();
    const opponentType = getOpponentType();

    if (opponentType) {
      const navLink = NavLink(
        opponentTypesObject[opponentType],
        'fa-solid fa-gamepad ',
        gameActions.changeGameType
      );
      navLink.getBtn().setAttribute('title', 'Change Game Type');
      getDivOne().append(navLink.render());
    }

    if (roomCodeId && gameActions.exitRoom) {
      const navLink = NavLink(
        'Exit Room',
        'fa-solid fa-door-open',
        gameActions.exitRoom
      );
      getDivOne().append(navLink.render());
    }

    if (user && gameActions.logout) {
      const navLink = NavLink(
        'Logout',
        'fa-solid fa-power-off',
        gameActions.logout
      );
      getDivOne().append(navLink.render());
    }

    getDiv().append(getDivOne());
    return getDiv();
  };

  return {
    render,
  };
};

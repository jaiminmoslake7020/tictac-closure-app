import {useDiv} from '@components/base';
import {NavLink} from '@components/base/ux/NavLink';
import {getGameId, getRoomCodeId, getUser} from '@session/index';
import {GameActionsType} from '@components/game/GameActions';


export const NavBar = (gameActions: GameActionsType) => {
  const {
    getDiv, setDiv
  } = useDiv();
  const {
    getDiv: getDivOne, setDiv: setDivOne
  } = useDiv();

  // console.log('gameActions', gameActions);

  const render = () => {
    setDiv('navbar-wrapper');
    setDivOne('navbar');

    const user = getUser();
    const roomCodeId = getRoomCodeId();
    const gameId = getGameId();

    // if (gameId) {
    //   const n1 = NavLink('Exit Room', 'fa-solid fa-arrow-up-from-bracket rotate-[270deg] ', gameActions.exitGame);
    //   getDivOne().append(n1.render());
    // }

    if (roomCodeId && gameActions.exitRoom) {
      const n2 = NavLink('Exit Room', 'fa-solid fa-door-open', gameActions.exitRoom);
      getDivOne().append(n2.render());
    }

    if (user && gameActions.logout) {
      const n3 = NavLink('Logout', 'fa-solid fa-power-off', gameActions.logout);
      getDivOne().append(n3.render());
    }

    getDiv().append(getDivOne());
    return getDiv();
  }

  return {
    render
  }
}

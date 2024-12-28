import {useDiv} from '@components/base';
import {NavBar} from '@components/layouts/navbar/NavBar';
import {GameActionsType} from '@types-dir/index';

export const Header = (gameActions: GameActionsType) => {
  const {
    getDiv, setDiv
  } = useDiv();
  const {
    getDiv: getDivOne, setDiv: setDivOne
  } = useDiv();

  const render = () => {
    setDiv('header-wrapper');
    setDivOne('header');

    const n = NavBar(gameActions);
    getDivOne().append(n.render());

    getDiv().append(getDivOne());
    return getDiv();
  }

  return {
    render
  }
}

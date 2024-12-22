import {appendEl} from '@utils/index';
import {Game} from './game/Game';
import {User} from './user/User';
import {initializeContexts} from '@contexts/index';

export const App = () => {

  const contextsData = initializeContexts();

  const initGame = () => {
    const t = Game(contextsData);
    t.init();
  }

  const init = () => {
    const t = User(contextsData, initGame);
    const f = t.render();
    if (f) {
      appendEl('#root', f);
    } else {
      // keepSessionAliveInterval();
      initGame();
    }
  }

  return {
    init
  }
}

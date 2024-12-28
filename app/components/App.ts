import {addToRoot, appendEl} from '@utils/index';
import {Game} from './game/Game';
import {User} from './user/User';
import {initializeContexts} from '@contexts/index';

export const App = () => {

  const contextsData = initializeContexts();

  const initGame = () => {
    const t = Game(contextsData, init);
    t.init();
  }

  const init = () => {
    const t = User(contextsData, initGame);
    const f = t.render();
    if (f) {
      addToRoot(f);
    } else {
      // keepSessionAliveInterval(contextsData);
      initGame();
    }
  }

  return {
    init
  }
}

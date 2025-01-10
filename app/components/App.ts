import {addToRoot} from '@utils/index';
import {Game} from './game/Game';
import {User} from './user/User';
import {initializeContexts, useContextUserSession} from '@contexts/index';
import {unliveUser, upsertUser} from '@firebase-dir/user';

export const App = () => {

  const contextsData = initializeContexts();
  let isTabClosed = true;

  const beforeUnloadEvent = (event: BeforeUnloadEvent) => {
    // console.log('event', event);
    event.preventDefault();
    event.returnValue = ''; // This is required for older browsers to show a confirmation dialog
    isTabClosed = false;

    // Optional: Perform any cleanup or save data here
    // console.log('Window is about to close!');
  }

  const unloadEvent = async (event: BeforeUnloadEvent) => {
    if (isTabClosed) {
      // console.log('Tab is being closed!');
      // Perform tab-specific cleanup actions here
      const { getUser } = useContextUserSession(contextsData);
      await unliveUser(getUser().id);
    }
  }

  const addCloseWindow = () => {
    // console.log('addCloseWindow');
    window.addEventListener('beforeunload', beforeUnloadEvent);
    window.addEventListener('unload', unloadEvent);
  }

  const removeCloseWindow = () => {
    // console.log('removeCloseWindow');
    window.removeEventListener('beforeunload', beforeUnloadEvent);
    window.removeEventListener('unload', unloadEvent);
  }

  const initGame = () => {
    const t = Game(contextsData, async () => {
      // removeCloseWindow();
      await init();
    });
    t.init();
  }

  const init = () => {
    const t = User(contextsData, initGame);
    const f = t.render();
    if (f) {
      addToRoot(f);
    } else {
      // keepSessionAliveInterval(contextsData);
      // addCloseWindow();
      initGame();
    }
  }

  return {
    init
  }
}

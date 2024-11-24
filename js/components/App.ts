import {appendEl} from '../utils/index.js'
import { AskForAppLevelType } from './AskForAppLevelType.js';
import { LoadTicTacApp } from './LoadTicTacApp.js';
import {initializeContexts} from '../contexts/index.js';

export const App = () => {

  const contextsData = initializeContexts();

  const onLevelSelected = () => {
    LoadTicTacApp( contextsData ).render();
  }

  const init = () => {
    const t = AskForAppLevelType( onLevelSelected , false, contextsData);
    const f = t.render();
    if ( f ) {
      appendEl('#root', f);
    }
  }

  return {
    init
  }
}

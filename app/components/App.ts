import {appendEl} from '../utils'
import { AskForAppLevelType } from './AskForAppLevelType';
import { LoadTicTacApp } from './LoadTicTacApp';
import {initializeContexts} from '../contexts';

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

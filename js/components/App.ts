import {appendEl} from '../utils/index.js'
import {AppLevelType} from '../types/index.js';
import { AskForAppLevelType } from './AskForAppLevelType.js';
import { LoadTicTacApp } from './LoadTicTacApp.js';

export const App = () => {

  const onLevelSelected = (v: AppLevelType) => {
    LoadTicTacApp(v).render();
  }

  const init = () => {
    const t = AskForAppLevelType( onLevelSelected );
    const f = t.render();
    if ( f ) {
      appendEl('#root', f);
    }
  }

  return {
    init
  }
}

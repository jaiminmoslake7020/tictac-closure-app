import {AppLevelType, TicTacFunctionReturnType} from '../types/index.js';
import {TicTac} from './TicTac.js';
import {appendEl} from '../utils/index.js';

export const LoadTicTacApp = (appLevel: AppLevelType) => {
  const t = TicTac( appLevel ) as TicTacFunctionReturnType;
  const render = () => {
    appendEl('#root', t.render());
    window.history.pushState(null, '', '#/app');
  }
  return {
    render
  }
}

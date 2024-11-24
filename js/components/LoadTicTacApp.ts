import {TicTacFunctionReturnType} from '../types/index.js';
import {TicTac} from './TicTac.js';
import {appendEl} from '../utils/index.js';
import {InitializeContextsFunctionType} from '../contexts/index.js';

export const LoadTicTacApp = (contextsData: InitializeContextsFunctionType) => {
  const t = TicTac( contextsData ) as TicTacFunctionReturnType;
  const render = () => {
    appendEl('#root', t.render());
    window.history.pushState(null, '', '#/app');
  }
  return {
    render
  }
}

import {TicTacFunctionReturnType} from '../types';
import {TicTac} from './TicTac';
import {appendEl} from '../utils';
import {InitializeContextsFunctionType} from '../contexts';

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

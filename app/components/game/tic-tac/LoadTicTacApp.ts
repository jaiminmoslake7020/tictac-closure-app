import {TicTacFunctionReturnType} from '@types-dir/index';
import {TicTac} from './TicTac';
import {appendEl} from '@utils/index';
import {InitializeContextsFunctionType} from '@contexts/index';

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

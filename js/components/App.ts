import { appendEl } from '../utils/index.js'
import { TicTac } from './TicTac.js'
import {TicTacFunctionReturnType} from '../types/index.js';

export const App = () => {
  const t = TicTac() as TicTacFunctionReturnType;
  const init = () => {
    appendEl('#root', t.render());
  }
  return {
    init
  }
}

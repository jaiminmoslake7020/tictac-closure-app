import { appendEl } from '../utils/index.js'
import { TicTac } from './TicTac.js'

export const App = () => {
  const t = TicTac();
  const init = () => {
    appendEl('#root', t.render());
  }
  return {
    init
  }
}

import { createEL } from '../utils/index.js'
import {TurnType, WinnerType} from '../types/index.js';

export const TurnInfo = (turn: TurnType) => {
  const p = createEL('p');
  const render = () => {
    p.innerHTML = 'Current Turn:'+turn;
    return p;
  }
  const update = (newTurn: TurnType, winner: WinnerType) => {
    if (winner) {
      p.innerHTML = 'Found Winner:'+winner;
    } else {
      p.innerHTML = 'Current Turn:'+newTurn;
    }
  }
  return {
    render,
    update
  }
}

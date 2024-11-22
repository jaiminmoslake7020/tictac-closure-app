import { createEL } from '../utils/index.js'
import {TurnType, WinnerType} from '../types/index.js';

export const TurnInfo = (turn: TurnType) => {
  const p = createEL('p');
  const render = () => {
    p.classList.add('current-turn');
    p.innerHTML = 'You are "'+turn+'"';
    return p;
  }
  const update = (newTurn: TurnType, winner: WinnerType) => {
    if (winner) {
      p.classList.add('winner-found');
      p.innerHTML = 'Found Winner:'+winner;
    }
  }
  return {
    render,
    update
  }
}

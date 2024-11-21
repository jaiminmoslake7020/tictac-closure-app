import { createEL } from '../utils/index.js'

export const TurnInfo = (turn) => {
  const p = createEL('p');
  const render = () => {
    p.innerHTML = 'Current Turn:'+turn;
    return p;
  }
  const update = (newTurn, winner) => {
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

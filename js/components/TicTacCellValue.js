import { AddStyle } from './AddStyle.js';
import { createEL } from '../utils/index.js';

export const TicTacCellValue = (columnId, firstTime) => {
  const span = createEL('span');

  const addStyle = () => {
    if (firstTime) {
      AddStyle('.tic-tac-cell-value', '.tic-tac-cell-value{ display: flex; justify-content:center; align-items:center; }');
    }
  }
  const render = () => {
    span.classList.add('tic-tac-cell-value');
    return span;
  }

  const update = (v) => {
    console.log('appliedTurn update', v, span.innerHTML)
    span.innerHTML = v;
  }

  addStyle();
  return {
    render,
    update
  }
}

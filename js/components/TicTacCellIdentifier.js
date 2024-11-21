import { AddStyle } from './AddStyle.js';
import { createEL } from '../utils/index.js';

export const TicTacCellIdentifier = (columnId, firstTime) => {
  const addStyle = () => {
    if (firstTime) {
      AddStyle('.tic-tac-cell-span', '.tic-tac-cell-span{ position:absolute; top:0; right:2px; font-size:12px; display:none; }');
    }
  }

  const render = () => {
    const span = createEL('span');
    span.classList.add('tic-tac-cell-span');
    span.innerHTML = columnId;
    return span;
  }

  addStyle();
  return {
    render
  }
}

import { createEL } from '../utils/index.js';
import {ColumnIdType} from '../types/index.js';

export const TicTacCellIdentifier = (columnId:ColumnIdType, firstTime: boolean) => {

  const render = () => {
    const span = createEL('span');
    span.classList.add('tic-tac-cell-span');
    span.innerHTML = columnId;
    return span;
  }

  return {
    render
  }
}

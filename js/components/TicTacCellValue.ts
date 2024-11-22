import { createEL } from '../utils/index.js';
import {ColumnIdType, TurnType} from '../types/index.js';

export const TicTacCellValue = (columnId: ColumnIdType, firstTime: boolean) => {
  const span = createEL('span');

  const render = () => {
    span.classList.add('tic-tac-cell-value');
    return span;
  }

  const update = (v: TurnType) => {
    span.innerHTML = v;
  }

  return {
    render,
    update
  }
}

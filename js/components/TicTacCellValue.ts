import { AddStyle } from './AddStyle.js';
import { createEL } from '../utils/index.js';
import {ColumnIdType, TurnType} from '../types/index.js';

export const TicTacCellValue = (columnId: ColumnIdType, firstTime: boolean) => {
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

  const update = (v: TurnType) => {
    span.innerHTML = v;
  }

  addStyle();
  return {
    render,
    update
  }
}

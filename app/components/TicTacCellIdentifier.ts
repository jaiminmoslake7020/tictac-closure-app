import { createEL } from '../utils';
import {ColumnIdType} from '../types';

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

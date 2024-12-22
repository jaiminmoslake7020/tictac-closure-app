import { createEL } from '@utils/index';
import {ColumnIdType} from '@types-dir/index';

export const TicTacCellIdentifier = (columnId:ColumnIdType) => {

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

import { createEL } from '@utils/index';
import { ColumnIdType } from '@types-dir/index';

export type TicTacCellIdentifierType = {
  render: () => HTMLSpanElement;
};

export const TicTacCellIdentifier = (
  columnId: ColumnIdType
): TicTacCellIdentifierType => {
  const render = () => {
    const span = createEL('span') as HTMLSpanElement;
    span.classList.add('tic-tac-cell-span');
    span.innerHTML = columnId;
    return span;
  };

  return {
    render,
  };
};

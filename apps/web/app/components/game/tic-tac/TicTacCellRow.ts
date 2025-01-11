import { createEL } from '@utils/index';
import { TicTacCell } from '@tic-tac/tic-tac-cell/TicTacCell';
import {
  ChangeFunctionType,
  ColumnIdType,
  TicTacCellFunctionType,
} from '@types-dir/index';
import { InitializeContextsFunctionType } from '@contexts/index';

export const TicTacCellRow = (
  rowId: number,
  changeTurn: ChangeFunctionType,
  contextData: InitializeContextsFunctionType,
) => {
  const tdArray = [] as TicTacCellFunctionType[];

  const render = () => {
    const tr = createEL('div');
    tr.classList.add('tic-tac-row');
    tr.setAttribute('id', 'row-' + rowId);
    for (let i = 0; i < 3; i++) {
      const td = TicTacCell(
        (rowId + '-' + (i + 1)) as ColumnIdType,
        i === 0 && rowId === 1,
        changeTurn,
        contextData,
      );
      tdArray.push(td);
      tr.append(td.render());
    }
    return tr as HTMLTableRowElement;
  };

  const update = (newChangeTurn: ChangeFunctionType) => {
    for (let i = 0; i < 3; i++) {
      tdArray[i].update(newChangeTurn);
    }
  };

  const reset = (newChangeTurn: ChangeFunctionType) => {
    for (let i = 0; i < 3; i++) {
      tdArray[i].reset(newChangeTurn);
    }
  };

  return {
    render,
    update,
    reset,
  };
};

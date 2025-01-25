import { createEL } from '@utils/index';
import {
  TicTacCell,
  TicTacCellFunctionType,
} from '@tic-tac/tic-tac-cell/TicTacCell';
import { ChangeFunctionType, ColumnIdType } from '@types-dir/index';
import { InitializeContextsFunctionType } from '@contexts/index';
import { useState } from '@components/base';

export type TicTacCellRowRenderFunctionType = () => HTMLDivElement;
export type TicTacCellRowUpdateFunctionType = (
  newChangeTurn: ChangeFunctionType
) => void;

export type TicTacCellRowFunctionType = {
  render: TicTacCellRowRenderFunctionType;
  update: TicTacCellRowUpdateFunctionType;
  reset: (newChangeTurn: ChangeFunctionType) => void;
  exitGame: () => void;
};

export const TicTacCellRow = (
  rowId: number,
  changeTurn: ChangeFunctionType,
  contextData: InitializeContextsFunctionType
): TicTacCellRowFunctionType => {
  const tdArray = [] as TicTacCellFunctionType[];

  const { get, set, remove } = useState();

  const render = () => {
    const tr = createEL('div');
    set(tr);
    tr.classList.add('tic-tac-row');
    tr.setAttribute('id', 'row-' + rowId);
    for (let i = 0; i < 3; i++) {
      const td = TicTacCell(
        (rowId + '-' + (i + 1)) as ColumnIdType,
        changeTurn,
        contextData
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

  const exitGame = () => {
    for (let i = 0; i < 3; i++) {
      tdArray[i].exitGame();
    }

    tdArray.pop();
    tdArray.pop();
    tdArray.pop();
    get().remove();
    remove();
  };

  return {
    render,
    update,
    reset,
    exitGame,
  };
};

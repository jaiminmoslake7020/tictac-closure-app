import { ChangeFunctionType, ColumnIdType } from '@types-dir/index';
import { InitializeContextsFunctionType } from '@contexts/index';
import { Reset } from './reset/Reset';
import { Update } from './update/Update';
import { Render } from './render/Render';
import { Remove } from './remove/Remove';

export type TicTacCellRenderFunctionType = () => HTMLDivElement;
export type TicTacCellUpdateFunctionType = (
  newChangeTurn: ChangeFunctionType
) => void;

export type TicTacCellFunctionType = {
  render: TicTacCellRenderFunctionType;
  update: TicTacCellUpdateFunctionType;
  reset: (newChangeTurn: ChangeFunctionType) => void;
  exitGame: () => void;
};

export const TicTacCell = (
  columnId: ColumnIdType,
  changeTurn: ChangeFunctionType,
  contextData: InitializeContextsFunctionType
): TicTacCellFunctionType => {
  const reset = (newChangeTurn: ChangeFunctionType) => {
    Reset(contextData, columnId, newChangeTurn);
  };

  const update = (newChangeTurn: ChangeFunctionType) => {
    Update(contextData, columnId, newChangeTurn);
  };

  const render = () => {
    return Render(contextData, columnId, changeTurn);
  };

  const exitGame = () => {
    Remove(columnId);
  };

  return {
    render,
    update,
    reset,
    exitGame,
  };
};

import {ChangeFunctionType, ColumnIdType} from '../../../types';
import {InitializeContextsFunctionType} from '../../../contexts';
import {Reset} from './tic-tac-cell/Reset/Reset';
import {Update} from './tic-tac-cell/Update/Update';
import {Render} from './tic-tac-cell/Render/Render';

export const TicTacCell = (columnId: ColumnIdType, firstTime: boolean, changeTurn: ChangeFunctionType, contextData: InitializeContextsFunctionType) => {

  const reset = (newChangeTurn: ChangeFunctionType) => {
    Reset( contextData, columnId, newChangeTurn );
  }

  const update = (newChangeTurn: ChangeFunctionType) => {
    Update(contextData, columnId, newChangeTurn);
  }

  const render = () => {
    return Render(contextData, columnId, changeTurn);
  }

  return {
    render,
    update,
    reset
  };
}

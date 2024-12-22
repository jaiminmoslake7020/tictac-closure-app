import {ChangeFunctionType, ColumnIdType} from '@types-dir/index';
import {InitializeContextsFunctionType} from '@contexts/index';
import {Reset} from './Reset/Reset';
import {Update} from './Update/Update';
import {Render} from './Render/Render';

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

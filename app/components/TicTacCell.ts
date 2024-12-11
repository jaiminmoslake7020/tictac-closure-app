import {ChangeFunctionType, ColumnIdType} from '../types';
import {InitializeContextsFunctionType} from '../contexts';
import {Reset} from './TicTacCell/Reset/Reset';
import {Update} from './TicTacCell/Update/Update';
import {Render} from './TicTacCell/Render/Render';

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

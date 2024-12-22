import {InitializeContextsFunctionType, isItRemoteGame, isItRemotePlayerTurn} from '@contexts/index';
import {ChangeFunctionType, ColumnIdType} from '@types-dir/index';
import {TicTacCellIdentifier} from '@tic-tac/tic-tac-cell/TicTacCellIdentifier';
import {addTd, getTd, tdClassList} from '@tic-tac/tic-tac-cell/Common';
import {addClickListener} from '@tic-tac/tic-tac-cell/Onclick/OnClick';

export const Render = (
  contextData: InitializeContextsFunctionType,
  columnId: ColumnIdType,
  changeTurn: ChangeFunctionType
) => {
  const id = TicTacCellIdentifier(columnId);
  const td = document.createElement('div');
  td.setAttribute('id', 'column-' + columnId);
  td.classList.add('tic-tac-cell');
  td.append(id.render());
  addTd( columnId,  td);
  if (isItRemoteGame(contextData) && isItRemotePlayerTurn(contextData)) {
    getTd(columnId).classList.add(tdClassList.typeDisabled);
  } else {
    addClickListener(contextData, columnId, changeTurn);
  }
  return getTd(columnId);
}

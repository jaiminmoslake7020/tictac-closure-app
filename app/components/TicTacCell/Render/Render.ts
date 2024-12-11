import {InitializeContextsFunctionType, isItRemoteGame, isItRemotePlayerTurn} from '../../../contexts';
import {ChangeFunctionType, ColumnIdType} from '../../../types';
import {TicTacCellIdentifier} from '../../TicTacCellIdentifier';
import {addTd, getTd, tdClassList} from '../Common';
import {addClickListener} from '../Onclick/OnClick';

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

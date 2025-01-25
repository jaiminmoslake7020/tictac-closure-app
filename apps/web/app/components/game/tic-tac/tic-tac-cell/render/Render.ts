import {
  InitializeContextsFunctionType,
  isItRemoteGame,
  isItRemotePlayerTurn,
  isUsedTurn,
  useContextTurnStorage,
} from '@contexts/index';
import {
  ChangeFunctionType,
  ColumnIdType,
  MovePositionType,
} from '@types-dir/index';
import { TicTacCellIdentifier } from '@tic-tac/tic-tac-cell/TicTacCellIdentifier';
import {
  addTd,
  anotherPersonMove,
  disableCell,
  getTd,
  unfilledItem,
  userMove,
} from '@tic-tac/tic-tac-cell/common';
import { addClickListener } from '@tic-tac/tic-tac-cell/on-click/OnClick';
import { turnData } from '@data/index';

export const CheckPreviouslyStoredMoves = (
  contextData: InitializeContextsFunctionType,
  columnId: ColumnIdType
) => {
  const { getTurnStorage } = useContextTurnStorage(contextData);
  const turns = getTurnStorage();
  if (turns) {
    const moveType = columnId.replace('-', '') as MovePositionType;
    if (turns[turnData.turn] && turns[turnData.turn].includes(moveType)) {
      userMove(columnId);
    } else if (
      turns[turnData.anotherTurn] &&
      turns[turnData.anotherTurn].includes(moveType)
    ) {
      anotherPersonMove(columnId);
    } else {
      unfilledItem(columnId);
    }
  } else {
    unfilledItem(columnId);
  }
};

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
  addTd(columnId, td);
  if (isItRemoteGame(contextData) && isItRemotePlayerTurn(contextData)) {
    disableCell(columnId);
  } else if (!isUsedTurn(contextData, columnId)) {
    addClickListener(contextData, columnId, changeTurn);
  }
  CheckPreviouslyStoredMoves(contextData, columnId);
  return getTd(columnId);
};

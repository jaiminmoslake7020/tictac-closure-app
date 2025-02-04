import {
  InitializeContextsFunctionType,
  isItGameWithOpenAi,
  isItRemoteGame,
  isItRemotePlayerTurn,
  useContextTurnStorage,
  useContextWinnerSeq,
} from '@contexts/index';
import {
  ChangeFunctionType,
  ColumnIdType,
  MovePositionType,
} from '@types-dir/index';
import {
  addClickListener,
  removeClickListener,
} from '@tic-tac/tic-tac-cell/on-click/OnClick';
import {
  anotherPersonMove,
  checkWinnerIsAvailable,
  disableCell,
  getTd,
  tdClassList,
} from '@tic-tac/tic-tac-cell/common';

export const Update = (
  contextData: InitializeContextsFunctionType,
  columnId: ColumnIdType,
  newChangeTurn: ChangeFunctionType
) => {
  const { getAnotherPlayerTurns } = useContextTurnStorage(contextData);
  const { getWinnerSequence } = useContextWinnerSeq(contextData);
  const moveType = columnId.replace('-', '') as MovePositionType;
  const anotherPersonMoves = getAnotherPlayerTurns();
  const winnerSequence = getWinnerSequence();
  removeClickListener(columnId);

  if (winnerSequence !== null && Array.isArray(winnerSequence)) {
    checkWinnerIsAvailable(contextData, columnId);
  } else {
    if (isItRemoteGame(contextData) && isItRemotePlayerTurn(contextData)) {
      disableCell(columnId);
    }
    if (isItGameWithOpenAi(contextData) && isItRemotePlayerTurn(contextData)) {
      disableCell(columnId);
    } else if (Array.isArray(anotherPersonMoves)) {
      if (!anotherPersonMoves.includes(moveType)) {
        addClickListener(contextData, columnId, newChangeTurn);
      } else if (!getTd(columnId).classList.contains(tdClassList.typeX)) {
        anotherPersonMove(columnId);
      }
    } else if (winnerSequence === null) {
      addClickListener(contextData, columnId, newChangeTurn);
    }
  }
};

import {
  InitializeContextsFunctionType, isItRemoteGame,
  isItRemotePlayerTurn,
  useContextTurnStorage,
  useContextWinnerSeq
} from '../../../contexts';
import {ChangeFunctionType, ColumnIdType, MovePositionType} from '../../../types';
import {addClickListener, removeClickListener} from '../Onclick/OnClick';
import {anotherPersonMove, checkWinnerIsAvailable, getTd, tdClassList} from '../Common';

export const Update = (
  contextData: InitializeContextsFunctionType,
  columnId: ColumnIdType,
  newChangeTurn: ChangeFunctionType
) => {
  const {getAnotherPlayerTurns} = useContextTurnStorage(contextData);
  const {getWinnerSequence} = useContextWinnerSeq(contextData);
  const moveType = columnId.replace('-', '') as MovePositionType;
  const anotherPersonMoves = getAnotherPlayerTurns();
  const winnerSequence = getWinnerSequence();
  removeClickListener( columnId );
  if ( isItRemoteGame(contextData) && isItRemotePlayerTurn(contextData) ) {
    if (!getTd(columnId).classList.contains(tdClassList.typeDisabled)) {
      console.log('disbaleing as it is other player move');
      getTd(columnId).classList.add( tdClassList.typeDisabled );
    }
  } else if (Array.isArray(anotherPersonMoves) && winnerSequence === null) {
    if (
      !anotherPersonMoves.includes(moveType)
    ) {
      addClickListener( contextData, columnId, newChangeTurn );
    } else if (!getTd(columnId).classList.contains(tdClassList.typeX)) {
      anotherPersonMove(columnId);
    }
  } else {
    if (winnerSequence === null) {
      addClickListener( contextData, columnId, newChangeTurn );
    } else  {
      checkWinnerIsAvailable(contextData, columnId);
    }
  }
}

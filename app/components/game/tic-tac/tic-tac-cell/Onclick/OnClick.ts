import {TicTacCellValue} from '../../TicTacCellValue';
import {addFn, getClicked, getFn, getTd, getTdCell, hasFn, hasTdCell, setClicked, tdClassList} from '../Common';
import {ChangeFunctionType, ColumnIdType, MovePositionType, TurnType} from '../../../../../types';
import {InitializeContextsFunctionType, useContextTurnHookType} from '../../../../../contexts';

export const OnClick = async (
  appliedTurn: TurnType, appliedChangeTurn: ChangeFunctionType, columnId: ColumnIdType, e: Event,
) => {
  const moveType = columnId.replace('-', '') as MovePositionType;
  const clicked = getClicked( columnId );
  if (!clicked) {
    getTd(columnId).classList.add('type-' + appliedTurn);
    if (hasTdCell( columnId )) {
      getTdCell(columnId).addText( appliedTurn );
    } else {
      const cv = TicTacCellValue();
      getTd(columnId).append(cv.render());
      cv.addText( appliedTurn );
    }
    setClicked( columnId );
    await appliedChangeTurn(moveType);
  } else {
    getTd(columnId).classList.add(tdClassList.typeError);
    setTimeout(() => {
      getTd(columnId).classList.remove(tdClassList.typeError);
    }, 200);
  }
}

export const removeClickListener = (columnId: ColumnIdType) => {
  const newElement = getTd(columnId) as HTMLDivElement;
  if ( hasFn(columnId) ) {
    console.log('removeEventListener');
    getTd(columnId).removeEventListener('click', getFn(columnId) )
  } else {
    console.log('removeEventListener not exists');
  }
}

export const addClickListener = (
  contextData: InitializeContextsFunctionType,
  columnId: ColumnIdType,
  newChangeTurn: ChangeFunctionType,
) => {
  if (getTd(columnId).classList.contains(tdClassList.typeDisabled)) {
    getTd(columnId).classList.remove( tdClassList.typeDisabled );
  }
  console.log('addClickListener', columnId);
  const {getTurn} = useContextTurnHookType(contextData);
  const newTurn = getTurn();
  const onClickFunction = OnClick.bind(null, newTurn, newChangeTurn, columnId);
  addFn( columnId, onClickFunction );
  getTd(columnId).addEventListener('click', onClickFunction );
}

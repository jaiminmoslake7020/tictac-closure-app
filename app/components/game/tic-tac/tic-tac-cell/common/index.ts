import {
  clickedHelper,
  stopAnimateMoveSuccess,
  OnClickCollection,
  TdCollection,
  TdCellCollection,
  StopAnimateMoveX
} from '@helpers/index';
import {
  ColumnIdType,
  MovePositionType,
  TDClassIdType,
  WiningSequenceType,
} from '@types-dir/index';
import {TicTacCellValue} from '@tic-tac/tic-tac-cell/TicTacCellValue';
import {InitializeContextsFunctionType, useContextTurnStorage, useContextWinnerSeq} from '@contexts/index';

// console.log("common/index");

const {
  get: getStopAnimateMoveSuccess,
  increment: incrementStopAnimateMoveSuccess,
  reset: resetStopAnimateMoveSuccess,
} = stopAnimateMoveSuccess();

const {
  addFn, getFn, hasFn
} = OnClickCollection();

const {
  addTd, hasTd, getTd
} = TdCollection();

const {
  addTdCell, hasTdCell, getTdCell
} = TdCellCollection();

export {
  getStopAnimateMoveSuccess,
  incrementStopAnimateMoveSuccess,
  resetStopAnimateMoveSuccess
};

const {
  setUnClicked,
  setClicked,
  getClicked
} = clickedHelper();

export {
  setUnClicked,
  setClicked,
  getClicked,
  addFn,
  getFn,
  hasFn,
  addTd,
  hasTd,
  getTd,
  addTdCell,
  hasTdCell,
  getTdCell
};

export const tdClassList = {
  typeO: 'type-O',
  typeX: 'type-X',
  typeError: 'type-Error',
  typeSuccess: 'type-Success',
  typeDisabled: 'type-Disabled',
  stopAnimateMoveX: 'stop-animate-move-x',
  stopAnimateMoveSuccess: 'stop-animate-move-success'
} as Record<TDClassIdType, string>


export const anotherPersonMove = (columnId: ColumnIdType) => {
  const newElement = getTd(columnId) as HTMLDivElement;
  if (!newElement) {
    console.error("newElement should not be undefined", newElement);
  }

  newElement.classList.add(tdClassList.typeX);
  setTimeout(() => {
    newElement.classList.add(tdClassList.stopAnimateMoveX);
  }, StopAnimateMoveX);

  if ( hasTdCell(columnId) ) {
    getTdCell(columnId).addText('X');
  } else {
    const cv = TicTacCellValue();
    newElement.append(cv.render());
    cv.addText('X');
    addTdCell(columnId, cv);
  }

  setClicked(columnId);
}

export const winnerIsAvailable = (
  contextData: InitializeContextsFunctionType ,
  columnId: ColumnIdType,
  winnerSequence: WiningSequenceType
) => {
  const {getAnotherPlayerTurns} = useContextTurnStorage(contextData);
  const anotherPersonMoves = getAnotherPlayerTurns();
  const moveType = columnId.replace('-', '') as MovePositionType;
  if (winnerSequence.includes( moveType )) {
    setTimeout(() => {
      getTd(columnId).classList.add(tdClassList.typeSuccess);
      setTimeout(() => {
        getTd(columnId).classList.add(tdClassList.stopAnimateMoveSuccess);
      }, 200);
    }, getStopAnimateMoveSuccess());
    incrementStopAnimateMoveSuccess();
    if (
      Array.isArray(anotherPersonMoves)
      && anotherPersonMoves.includes(moveType)
      && !getTd(columnId).classList.contains(tdClassList.typeX)
    ) {
      anotherPersonMove(columnId);
    }
  } else {
    getTd(columnId).classList.add(tdClassList.typeDisabled);
  }
}

export const checkWinnerIsAvailable = (
  contextData: InitializeContextsFunctionType ,
  columnId: ColumnIdType
) => {
  const {getWinnerSequence} = useContextWinnerSeq(contextData);
  const winnerSequence = getWinnerSequence();
  if (Array.isArray(winnerSequence)) {
    winnerIsAvailable( contextData, columnId , winnerSequence);
  }
}

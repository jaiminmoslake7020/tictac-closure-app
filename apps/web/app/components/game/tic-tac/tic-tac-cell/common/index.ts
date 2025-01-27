import {
  clickedHelper,
  stopAnimateMoveSuccess,
  OnClickCollection,
  TdCollection,
  TdCellCollection,
  StopAnimateMoveXDuration,
} from '@helpers/index';
import {
  ColumnIdType,
  MovePositionType,
  TDClassIdType,
  TurnType,
  WiningSequenceType,
} from '@types-dir/index';
import { TicTacCellValue } from '@tic-tac/tic-tac-cell/TicTacCellValue';
import {
  InitializeContextsFunctionType,
  useContextTurnStorage,
  useContextWinnerSeq,
} from '@contexts/index';
import { turnData } from '@data/index';

const {
  get: getStopAnimateMoveSuccess,
  increment: incrementStopAnimateMoveSuccess,
  reset: resetStopAnimateMoveSuccess,
} = stopAnimateMoveSuccess();

const { addFn, getFn, hasFn, removeFn } = OnClickCollection();

const { addTd, hasTd, getTd, removeTd } = TdCollection();

const { addTdCell, hasTdCell, getTdCell, removeTdCell } = TdCellCollection();

const { setUnClicked, setClicked, getClicked, removeClicked } = clickedHelper();

export {
  getStopAnimateMoveSuccess,
  incrementStopAnimateMoveSuccess,
  resetStopAnimateMoveSuccess,
  setUnClicked,
  setClicked,
  getClicked,
  removeClicked,
  addFn,
  getFn,
  removeFn,
  hasFn,
  addTd,
  hasTd,
  getTd,
  removeTd,
  addTdCell,
  hasTdCell,
  getTdCell,
  removeTdCell,
};

export const tdClassList = {
  typeO: 'type-O',
  typeX: 'type-X',
  typeError: 'type-Error',
  typeSuccess: 'type-Success',
  typeDisabled: 'type-Disabled',
  stopAnimateMoveX: 'stop-animate-move-x',
  stopAnimateMoveSuccess: 'stop-animate-move-success',
} as Record<TDClassIdType, string>;

export const animateAnotherPersonMove = (newElement: HTMLDivElement) => {
  setTimeout(() => {
    newElement.classList.add(tdClassList.stopAnimateMoveX);
  }, StopAnimateMoveXDuration);
};

export const renderValue = (columnId: ColumnIdType, turn: TurnType) => {
  const newElement = getTd(columnId) as HTMLDivElement;
  if (!newElement) {
    console.error('newElement should not be undefined', newElement);
  }
  if (turnData.turn === turn) {
    newElement.classList.add(tdClassList.typeO);
  } else {
    newElement.classList.add(tdClassList.typeX);
    animateAnotherPersonMove(newElement);
  }
  if (hasTdCell(columnId)) {
    getTdCell(columnId).addText(turn);
  } else {
    const cv = TicTacCellValue();
    newElement.append(cv.render());
    cv.addText(turn);
    addTdCell(columnId, cv);
  }
};

export const userMove = (columnId: ColumnIdType) => {
  renderValue(columnId, turnData.turn);
  disableCell(columnId);
  setClicked(columnId);
};

export const anotherPersonMove = (columnId: ColumnIdType) => {
  renderValue(columnId, turnData.anotherTurn);
  disableCell(columnId);
  setClicked(columnId);
};

export const unfilledItem = (columnId: ColumnIdType) => {
  setUnClicked(columnId);
};

export const performSuccessAnimation = (columnId: ColumnIdType) => {
  setTimeout(() => {
    getTd(columnId).classList.add(tdClassList.typeSuccess);
    setTimeout(() => {
      getTd(columnId).classList.add(tdClassList.stopAnimateMoveSuccess);
    }, 200);
  }, getStopAnimateMoveSuccess());
  incrementStopAnimateMoveSuccess();
};

export const changeRelevantCellToSuccessStatus = (
  contextData: InitializeContextsFunctionType,
  columnId: ColumnIdType,
  winnerSequence: WiningSequenceType
) => {
  const { getAnotherPlayerTurns } = useContextTurnStorage(contextData);
  const anotherPersonMoves = getAnotherPlayerTurns();
  const moveType = columnId.replace('-', '') as MovePositionType;
  if (winnerSequence.includes(moveType)) {
    performSuccessAnimation(columnId);
    if (
      Array.isArray(anotherPersonMoves) &&
      anotherPersonMoves.includes(moveType) &&
      !getTd(columnId).classList.contains(tdClassList.typeX)
    ) {
      anotherPersonMove(columnId);
    }
  } else {
    getTd(columnId).classList.add(tdClassList.typeDisabled);
  }
};

export const disableCell = (columnId: ColumnIdType) => {
  if (!getTd(columnId).classList.contains(tdClassList.typeDisabled)) {
    getTd(columnId).classList.add(tdClassList.typeDisabled);
  }
};

export const enableCell = (columnId: ColumnIdType) => {
  if (getTd(columnId).classList.contains(tdClassList.typeDisabled)) {
    getTd(columnId).classList.remove(tdClassList.typeDisabled);
  }
};

export const checkWinnerIsAvailable = (
  contextData: InitializeContextsFunctionType,
  columnId: ColumnIdType
) => {
  const { getWinnerSequence } = useContextWinnerSeq(contextData);
  const winnerSequence = getWinnerSequence();
  if (Array.isArray(winnerSequence)) {
    changeRelevantCellToSuccessStatus(contextData, columnId, winnerSequence);
  }
};

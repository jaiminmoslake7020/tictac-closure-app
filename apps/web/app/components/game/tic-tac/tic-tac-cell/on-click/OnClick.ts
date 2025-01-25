import {
  getClicked,
  getFn,
  getTd,
  hasFn,
  setClicked,
  renderValue,
  disableCell,
  addFn,
  enableCell,
} from '@tic-tac/tic-tac-cell/common';
import {
  ChangeFunctionType,
  ColumnIdType,
  MovePositionType,
  TurnType,
} from '@types-dir/index';
import {
  InitializeContextsFunctionType,
  useContextTurnHookType,
} from '@contexts/index';

export const removeClickListener = (columnId: ColumnIdType) => {
  if (hasFn(columnId)) {
    getTd(columnId).removeEventListener('click', getFn(columnId));
  }
};

export const addClickListener = (
  contextData: InitializeContextsFunctionType,
  columnId: ColumnIdType,
  newChangeTurn: ChangeFunctionType
) => {
  // INFO: we need this when game get's restarted we do not rerender the cell, but we remove the listener, and add new listener
  // and enable the cell
  enableCell(columnId);

  const { getTurn } = useContextTurnHookType(contextData);
  const newTurn = getTurn();
  const onClickFunction = OnClick.bind(null, newTurn, newChangeTurn, columnId);
  addFn(columnId, onClickFunction);
  getTd(columnId).addEventListener('click', onClickFunction);
};

export const OnClick = async (
  appliedTurn: TurnType,
  appliedChangeTurn: ChangeFunctionType,
  columnId: ColumnIdType
) => {
  const moveType = columnId.replace('-', '') as MovePositionType;
  const clicked = getClicked(columnId);
  if (!clicked) {
    renderValue(columnId, appliedTurn);
    setClicked(columnId);
    disableCell(columnId);
    removeClickListener(columnId);
    await appliedChangeTurn(moveType);
  }
};

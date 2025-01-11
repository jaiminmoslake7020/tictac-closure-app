import {
  getTd,
  getTdCell,
  tdClassList,
  setUnClicked,
  resetStopAnimateMoveSuccess,
} from '@tic-tac/tic-tac-cell/common';
import {
  ChangeFunctionType,
  ColumnIdType,
  TDClassIdType,
} from '@types-dir/index';
import {
  InitializeContextsFunctionType,
  isItRemoteGame,
  isItRemotePlayerTurn,
} from '@contexts/index';
import {
  addClickListener,
  removeClickListener,
} from '@tic-tac/tic-tac-cell/on-click/OnClick';

const removeAllNewClasses = (columnId: ColumnIdType) => {
  Object.keys(tdClassList).map((keyname: string | TDClassIdType) => {
    const className = tdClassList[keyname as TDClassIdType];
    if (getTd(columnId).classList.contains(className)) {
      getTd(columnId).classList.remove(className);
    }
  });
};

export const Reset = (
  contextData: InitializeContextsFunctionType,
  columnId: ColumnIdType,
  newChangeTurn: ChangeFunctionType,
) => {
  const cv = getTdCell(columnId);
  if (cv) {
    cv.removeText();
  }
  removeClickListener(columnId);
  setUnClicked(columnId);
  resetStopAnimateMoveSuccess();
  removeAllNewClasses(columnId);
  if (isItRemoteGame(contextData) && isItRemotePlayerTurn(contextData)) {
    getTd(columnId).classList.add(tdClassList.typeDisabled);
  } else {
    addClickListener(contextData, columnId, newChangeTurn);
  }
};

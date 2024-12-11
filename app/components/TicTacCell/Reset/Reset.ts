import {getTd, getTdCell, tdClassList, setUnClicked, resetStopAnimateMoveSuccess} from '../Common';
import {ChangeFunctionType, ColumnIdType, TDClassIdType} from '../../../types';
import {InitializeContextsFunctionType} from '../../../contexts';
import {addClickListener, removeClickListener} from '../Onclick/OnClick';

const removeAllNewClasses = (
  columnId: ColumnIdType,
) => {
  Object.keys(tdClassList).map((keyname: string | TDClassIdType) => {
    const className = tdClassList[keyname as TDClassIdType];
    if (getTd(columnId).classList.contains(className)) {
      getTd(columnId).classList.remove(className);
    }
  });
}

export const Reset = (
  contextData: InitializeContextsFunctionType,
  columnId: ColumnIdType,
  newChangeTurn: ChangeFunctionType
) => {
  const cv = getTdCell(columnId);
  if (cv !== null) {
    cv.remove();
  }
  removeClickListener(columnId);
  addClickListener(contextData, columnId, newChangeTurn);
  removeAllNewClasses(columnId);
  setUnClicked( columnId );
  resetStopAnimateMoveSuccess();
}

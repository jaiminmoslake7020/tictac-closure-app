import {
  getTd,
  getTdCell,
  resetStopAnimateMoveSuccess,
  removeTdCell,
  removeClicked,
  removeFn,
  removeTd,
  hasTd,
} from '@tic-tac/tic-tac-cell/common';
import { ColumnIdType } from '@types-dir/index';
import { removeClickListener } from '@tic-tac/tic-tac-cell/on-click/OnClick';

export const Remove = (columnId: ColumnIdType) => {
  if (hasTd(columnId)) {
    const currentTd = getTd(columnId);
    // INFO: we need to remove the span element, because we are going to remove the td element
    currentTd.querySelector('span.tic-tac-cell-span')?.remove();

    // INFO: we remove the td Cell Value element
    const cv = getTdCell(columnId);
    if (cv) {
      cv.remove();
      removeTdCell(columnId);
    }

    // INFO: we remove Clicks event from TD
    removeClickListener(columnId);
    removeFn(columnId);

    // INFO: we remove Clicked flag from TD
    removeClicked(columnId);

    // INFO: we reset Animation Success
    resetStopAnimateMoveSuccess();

    // INFO: we remove the td element
    currentTd.remove();
    removeTd(columnId);
  }
};

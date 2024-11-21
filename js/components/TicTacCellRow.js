import { createEL } from '../utils/index.js';
import { TicTacCell } from './TicTacCell.js';

export const TicTacCellRow = (rowId, turn, changeTurn) => {

  const tdArray = [];

  const render = () => {
    const tr = createEL('tr');
    tr.setAttribute('id', 'row-'+rowId);
    for (let i = 0 ; i < 3 ; i++)  {
      const td = TicTacCell( rowId+'-'+(i + 1) , i === 0 && rowId === 1 , turn, changeTurn);
      tdArray.push(td);
      tr.append(td.render());
    }
    return tr;
  }

  const update = (newTurn, newChangeTurn, winnerSequence) => {
    for (let i = 0 ; i < 3 ; i++)  {
      // console.log('TicTacCellRow', newTurn);
      tdArray[i].update(newTurn, newChangeTurn, winnerSequence);
    }
  }

  return {
    render,
    update
  };
}

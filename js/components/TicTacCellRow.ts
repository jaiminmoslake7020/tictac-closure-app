import { createEL } from '../utils/index.js';
import { TicTacCell } from './TicTacCell.js';
import {
  AnotherPersonMovesTypeWithNull,
  ChangeFunctionType,
  ColumnIdType, TicTacCellFunctionType,
  TurnType,
  WiningSequenceTypeWithNull
} from '../types/index.js';

export const TicTacCellRow = (rowId: number, turn: TurnType, changeTurn: ChangeFunctionType) => {

  const tdArray = [] as TicTacCellFunctionType[];

  const render = () => {
    const tr = createEL('div');
    tr.classList.add('tic-tac-row')
    tr.setAttribute('id', 'row-'+rowId);
    for (let i = 0 ; i < 3 ; i++)  {
      const td = TicTacCell( rowId+'-'+(i + 1) as ColumnIdType , i === 0 && rowId === 1 , turn, changeTurn);
      tdArray.push(td);
      tr.append(td.render());
    }
    return tr as HTMLTableRowElement;
  }

  const update = (newTurn: TurnType, newChangeTurn: ChangeFunctionType, winnerSequence: WiningSequenceTypeWithNull, anotherPersonMoves: AnotherPersonMovesTypeWithNull) => {
    for (let i = 0 ; i < 3 ; i++)  {
      // console.log('TicTacCellRow', newTurn);
      tdArray[i].update(newTurn, newChangeTurn, winnerSequence, anotherPersonMoves);
    }
  }

  return {
    render,
    update
  };
}

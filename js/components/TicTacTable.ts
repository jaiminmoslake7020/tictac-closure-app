import {MoveType, TicTacCellRowFunctionType, TurnHandlerType} from '../types/index.js';
import {createEL} from '../utils/index.js';
import {TicTacCellRow} from './TicTacCellRow.js';

export const TicTacTable = ( getTurnHandlerType: () => TurnHandlerType , updateInfo : () => void ) => {

  let ticTacTable : undefined | HTMLDivElement;
  let ticTacTableBody : undefined | HTMLDivElement;

  const getTicTacTable = () : HTMLDivElement => {
    if (!ticTacTable) {
      setTicTacTable( createEL('div') as HTMLDivElement );
    }
    return ticTacTable as HTMLDivElement;
  }

  const setTicTacTable = (item: HTMLDivElement) => {
    ticTacTable = item;
  }

  const getTicTacTableBody = () : HTMLDivElement => {
    if (!ticTacTableBody) {
      setTicTacTableBody( createEL('div') as HTMLDivElement );
    }
    return ticTacTableBody as HTMLDivElement;
  }

  const setTicTacTableBody = (item: HTMLDivElement) => {
    ticTacTableBody = item;
  }

  const trArray = [] as TicTacCellRowFunctionType[];

  const handleChangeTurn = (v: MoveType) => {
    const {
      changeTurn,  getTurn, getWinner, getWinnerSequence, getAnotherPersonTurns
    } = getTurnHandlerType();
    changeTurn(v);
    const newTurn = getTurn();
    const winner = getWinner();
    const winnerSequence = getWinnerSequence();
    const anotherPersonTurns = getAnotherPersonTurns();
    for (let i = 0 ; i < 3 ; i++)  {
      trArray[i].update( newTurn , handleChangeTurn, winnerSequence, anotherPersonTurns);
    }
    updateInfo();
  }

  const render = () => {
    setTicTacTable( createEL('div') as HTMLDivElement );
    setTicTacTableBody( createEL('div') as HTMLDivElement );
    const {
      getTurn
    } = getTurnHandlerType();
    for (let i = 0 ; i < 3 ; i++)  {
      const turn = getTurn();
      const tr = TicTacCellRow( i + 1 ,  turn, handleChangeTurn );
      getTicTacTable().append(tr.render());
      trArray.push(tr);
    }
    getTicTacTable().classList.add('tic-tac-table');
    getTicTacTableBody().classList.add('tic-tac-table-body');
    getTicTacTable().append(getTicTacTableBody());
    return getTicTacTable();
  }

  const reset = () => {
    const {
      getTurn
    } = getTurnHandlerType();
    for (let i = 0 ; i < 3 ; i++)  {
      trArray[i].reset( getTurn(), handleChangeTurn );
    }
  }

  return {
    render,
    reset
  }
}

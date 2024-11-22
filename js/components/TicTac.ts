import {createEL} from '../utils/index.js'
import { TurnInfo } from './TurnInfo.js'
import { TurnHandler } from './TurnHandler.js'
import { TicTacCellRow } from './TicTacCellRow.js'
import {MoveType, TicTacCellRowFunctionType} from '../types/index.js';

export const TicTac = () => {
  const wrapperDiv = createEL('div');
  const ticTacTable = createEL('div');
  const ticTacTableBody = createEL('div');

  const trArray = [] as TicTacCellRowFunctionType[];
  const { getTurn, changeTurn, getWinner, getWinnerSequence, getAnotherPersonTurns } = TurnHandler();
  const turnInfoP = TurnInfo( getTurn() );

  const handleChangeTurn = (v: MoveType) => {
    changeTurn(v);
    const newTurn = getTurn();
    const winner = getWinner();
    const winnerSequence = getWinnerSequence();
    const anotherPersonTurns = getAnotherPersonTurns();
    for (let i = 0 ; i < 3 ; i++)  {
      trArray[i].update( newTurn , handleChangeTurn, winnerSequence, anotherPersonTurns);
    }
    turnInfoP.update( newTurn , winner);
  }

  const render = () => {
    for (let i = 0 ; i < 3 ; i++)  {
      const turn = getTurn();
      const tr = TicTacCellRow( i + 1 ,  turn, handleChangeTurn );
      ticTacTableBody.append(tr.render());
      trArray.push(tr);
    }
    ticTacTable.classList.add('tic-tac-table');
    ticTacTableBody.classList.add('tic-tac-table-body');
    ticTacTable.append(ticTacTableBody);
    // const b = createEL('button');
    // b.setAttribute('id', 'reset-button');
    // b.setAttribute('type', 'button');
    // b.innerHTML = 'Reset';
    // b.addEventListener('click', () => {
    //   findEl('table').remove();
    //   b.remove()
    //   findEl('p').remove();
    //   render();
    // })
    // wrapperDiv.append( b );
    wrapperDiv.append( turnInfoP.render() );
    wrapperDiv.append(ticTacTable);
    wrapperDiv.classList.add('wrapper-div')
    return wrapperDiv;
  }

  return {
    render
  };
}

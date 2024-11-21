import { createEL } from '../utils'
import { TurnInfo } from './TurnInfo.js'
import { TurnHandler } from './TurnHandler.js'
import { TicTacCellRow } from './TicTacCellRow.js'
import { AddStyle } from './AddStyle.js'

export const TicTac = () => {
  const wrapperDiv = createEL('div');
  const ticTacTable = createEL('table');
  const ticTacTableBody = createEL('tbody');

  const trArray = [];
  const { getTurn, changeTurn, getWinner, getWinnerSequence, getAnotherPersonTurns } = TurnHandler();
  const turnInfoP = TurnInfo( getTurn() );

  const handleChangeTurn = (v) => {
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
      const tr = TicTacCellRow( i + 1 , getTurn(), handleChangeTurn );
      ticTacTableBody.append(tr.render());
      trArray.push(tr);
    }
    ticTacTable.append(ticTacTableBody);
    wrapperDiv.append( turnInfoP.render() );
    wrapperDiv.append(ticTacTable);
    return wrapperDiv;
  }

  AddStyle('#root', '#root{ height: 100vh; width: 100vw; display:flex; justify-content:center; align-items:center;  } #root table{ border: 1px solid black; border-collapse: collapse; } #root table td{ border: 1px solid black; } ');
  return {
    render
  };
}

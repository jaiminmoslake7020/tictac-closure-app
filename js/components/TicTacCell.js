import { findEl } from '../utils/index.js';
import { TicTacCellIdentifier } from './TicTacCellIdentifier.js'
import { TicTacCellValue } from './TicTacCellValue.js'
import { AddStyle } from './AddStyle.js'

export const TicTacCell = (columnId, firstTime, turn, changeTurn) => {
  const cv = TicTacCellValue( columnId,  firstTime);
  const td = document.createElement('td');

  let clicked = false;

  const setClicked = () => {
    clicked = true;
  }

  const getTd = () => {
    return findEl('#column-'+columnId)
  }

  const onClick = (appliedTurn, appliedChangeTurn, e) => {
    if ( !clicked ) {
      getTd().classList.add('type-'+appliedTurn);
      const cv = TicTacCellValue( columnId,  firstTime);
      e.target.append(cv.render());
      cv.update(appliedTurn);
      setClicked();
      appliedChangeTurn( columnId.replace('-','') );
    } else {
      getTd().classList.add('type-Error');
      setTimeout(() => {
        getTd().classList.remove('type-Error');
      }, 200);
    }
  }

  const firstClick = (e)  => {
    onClick(turn, changeTurn, e);
  }

  const addStyle = () => {
    if (firstTime) {
      AddStyle('.tic-tac-cell-td', '.tic-tac-cell{  width: 4rem; height: 4rem; padding: 2rem; cursor: pointer; position:relative; }');
      AddStyle('.type-O', '.type-O{  background-color: #dfe3e8; cursor: not-allowed; }');
      AddStyle('.type-X', '.type-X{  background-color: #3e3737; color: white; cursor: not-allowed; }');
      AddStyle('.type-Error', '.type-Error{  background-color: red; color: white; }');
      AddStyle('.type-Success', '.type-Success{  background-color: green; color: white; cursor: not-allowed; }');
      AddStyle('.type-Disabled', '.type-Disabled{ cursor: not-allowed; opacity: 0.5;  }');
    }
  }

  const update = (newTurn, newChangeTurn, winnerSequence, anotherPersonTurns) => {
    const element = findEl('#column-'+columnId);

    // Clone the element
    const newElement = element.cloneNode(true);

    // Replace the original element with the clone
    element.parentNode.replaceChild(newElement, element);

    // console.log('anotherPersonTurns', anotherPersonTurns);
    if (Array.isArray(anotherPersonTurns) && winnerSequence === null) {
      if (
        !anotherPersonTurns.includes( columnId.replace('-','') )
      ) {
        newElement.addEventListener('click', (e) => {
          onClick(newTurn, newChangeTurn, e);
        });
      } else if ( !getTd().classList.contains('type-X') ) {
          getTd().classList.add('type-X');
          getTd().classList.add('type-X');
          const cv = TicTacCellValue( columnId,  firstTime);
          getTd().append(cv.render());
          cv.update('X');
          setClicked();
      }
    } else {
      if (winnerSequence === null) {
        newElement.addEventListener('click', (e) => {
          onClick(newTurn, newChangeTurn, e);
        });
      } else if ( Array.isArray(winnerSequence) ) {
        if ( winnerSequence.includes( columnId.replace('-','') ) ) {
          getTd().classList.add('type-Success');
          if (
            Array.isArray(anotherPersonTurns)
            && anotherPersonTurns.includes( columnId.replace('-','') )
            && !getTd().classList.contains('type-X')
          ) {
            getTd().classList.add('type-X');
            getTd().classList.add('type-X');
            const cv = TicTacCellValue( columnId,  firstTime);
            getTd().append(cv.render());
            cv.update('X');
            setClicked();
          }
        } else {
          getTd().classList.add('type-Disabled');
        }
      }
    }
  }

  const render = () => {
    const id = TicTacCellIdentifier( columnId,  firstTime);
    td.setAttribute('id', 'column-'+columnId);
    td.classList.add('tic-tac-cell');
    td.append(id.render());
    td.addEventListener('click',  firstClick);
    // console.log('event listener added', 'column-'+columnId)
    return td;
  }

  addStyle();
  return {
    render,
    update
  };
}

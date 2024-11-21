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
      console.log('appliedTurn', appliedTurn, columnId)
      getTd().classList.add('type-'+appliedTurn);
      const cv = TicTacCellValue( columnId,  firstTime);
      e.target.append(cv.render());
      cv.update(appliedTurn);
      setClicked();
      appliedChangeTurn( columnId.replace('-','') );
    } else {
      console.log('Click not allowed');
      getTd().classList.add('type-Error');
      setTimeout(() => {
        getTd().classList.remove('type-Error');
      }, 200);
    }
  }

  const firstClick = (e)  => {
    console.log('e', e);
    onClick(turn, changeTurn, e);
  }

  const addStyle = () => {
    if (firstTime) {
      AddStyle('.tic-tac-cell-td', '.tic-tac-cell{  width: 4rem; height: 4rem; padding: 2rem; cursor: pointer; position:relative; }');
      AddStyle('.type-O', '.type-O{  background-color: #dfe3e8; }');
      AddStyle('.type-X', '.type-X{  background-color: #3e3737; color: white; }');
      AddStyle('.type-Error', '.type-Error{  background-color: red; color: white; }');
      AddStyle('.type-Success', '.type-Success{  background-color: green; color: white; cursor: not-allowed; }');
      AddStyle('.type-Disabled', '.type-Disabled{ cursor: not-allowed; opacity: 0.5;  }');
    }
  }

  const update = (newTurn, newChangeTurn, winnerSequence) => {
    const element = findEl('#column-'+columnId);

    // Clone the element
    const newElement = element.cloneNode(true);

    // Replace the original element with the clone
    element.parentNode.replaceChild(newElement, element);

    console.log('winnerSequence', winnerSequence);
    if (winnerSequence === null) {
      newElement.addEventListener('click', (e) => {
        console.log('second e', e);
        onClick(newTurn, newChangeTurn, e);
      });
    } else if ( Array.isArray(winnerSequence) ) {
      if ( winnerSequence.includes( columnId.replace('-','') ) ) {
        getTd().classList.add('type-Success');
      } else {
        getTd().classList.add('type-Disabled');
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

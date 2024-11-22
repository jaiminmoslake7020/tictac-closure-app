import { findEl } from '../utils/index.js';
import { TicTacCellIdentifier } from './TicTacCellIdentifier.js'
import { TicTacCellValue } from './TicTacCellValue.js'
import {
  AnotherPersonMovesTypeWithNull,
  ChangeFunctionType,
  ColumnIdType,
  MoveType,
  TurnType,
  WiningSequenceTypeWithNull
} from '../types/index.js';

const StopAnimateMoveX = 200;

const stopAnimateMoveSuccess  = () => {
  let StopAnimateMoveSuccess = 400;

  const get = () => {
    return StopAnimateMoveSuccess;
  }

  const increment = () => {
    StopAnimateMoveSuccess += 300;
  }

  return {
    get,
    increment
  };
}

const {
  get: getStopAnimateMoveSuccess,
  increment:incrementStopAnimateMoveSuccess
} = stopAnimateMoveSuccess();


  export const TicTacCell = (columnId: ColumnIdType, firstTime: boolean, turn: TurnType, changeTurn: ChangeFunctionType) => {
  const cv = TicTacCellValue( columnId,  firstTime);
  const td = document.createElement('div');

  let clicked = false;

  const getMoveType = () : MoveType => {
    return columnId.replace('-','') as MoveType
  }

  const setClicked = () => {
    clicked = true;
  }

  const getTd = () => {
    return findEl('#column-'+columnId)
  }

  const onClick = (appliedTurn: TurnType, appliedChangeTurn: ChangeFunctionType, e:Event ) => {
    if ( !clicked ) {
      getTd().classList.add('type-'+appliedTurn);
      const cv = TicTacCellValue( columnId,  firstTime);
      (e.target as HTMLDivElement).append(cv.render());
      cv.update(appliedTurn);
      setClicked();
      appliedChangeTurn( getMoveType() );
    } else {
      getTd().classList.add('type-Error');
      setTimeout(() => {
        getTd().classList.remove('type-Error');
      }, 200);
    }
  }

  const firstClick = (e: Event)  => {
    onClick(turn, changeTurn, e);
  }

  const anotherPersonMove = () => {
    getTd().classList.add('type-X');
    setTimeout(() => {
      getTd().classList.add('stop-animate-move-x');
    },StopAnimateMoveX);
    const cv = TicTacCellValue( columnId,  firstTime);
    getTd().append(cv.render());
    cv.update('X');
    setClicked();
  }

  const update = (newTurn: TurnType, newChangeTurn: ChangeFunctionType, winnerSequence: WiningSequenceTypeWithNull, anotherPersonMoves: AnotherPersonMovesTypeWithNull) => {
    const element = findEl('#column-'+columnId);

    // Clone the element
    const newElement = element.cloneNode(true);

    // Replace the original element with the clone
    // @ts-ignore
    element.parentNode.replaceChild(newElement, element);

    // console.log('anotherPersonTurns', anotherPersonTurns);
    if (Array.isArray(anotherPersonMoves) && winnerSequence === null) {
      if (
        !anotherPersonMoves.includes( getMoveType() )
      ) {
        newElement.addEventListener('click', (e: Event) => {
          onClick(newTurn, newChangeTurn, e);
        });
      } else if ( !getTd().classList.contains('type-X') ) {
        anotherPersonMove();
      }
    } else {
      if (winnerSequence === null) {
        newElement.addEventListener('click', (e: Event) => {
          onClick(newTurn, newChangeTurn, e);
        });
      } else if ( Array.isArray(winnerSequence) ) {
        if ( winnerSequence.includes( getMoveType() ) ) {
          setTimeout(() => {
            getTd().classList.add('type-Success');
            setTimeout(() => {
              getTd().classList.add('stop-animate-move-success');
            }, 200 );
          }, getStopAnimateMoveSuccess() );
          incrementStopAnimateMoveSuccess();
          if (
            Array.isArray(anotherPersonMoves)
            && anotherPersonMoves.includes( getMoveType() )
            && !getTd().classList.contains('type-X')
          ) {
            anotherPersonMove();
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

  return {
    render,
    update
  };
}

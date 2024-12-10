import {findEl} from '../utils';
import {TicTacCellIdentifier} from './TicTacCellIdentifier'
import {TicTacCellValue} from './TicTacCellValue'
import {
  ChangeFunctionType,
  ColumnIdType,
  MovePositionType, TDClassIdType,
  TurnType
} from '../types';
import {
  InitializeContextsFunctionType,
  isItRemoteGame,
  isItRemotePlayerTurn,
  useContextTurnStorage,
  useContextWinnerSeq
} from '../contexts';
import {stopAnimateMoveSuccess, StopAnimateMoveX} from '../helpers';
import {turnData} from '../data';

const {
  get: getStopAnimateMoveSuccess,
  increment: incrementStopAnimateMoveSuccess,
  reset: resetStopAnimateMoveSuccess,
} = stopAnimateMoveSuccess();

export const tdClassList = {
  typeO: 'type-O',
  typeX: 'type-X',
  typeError: 'type-Error',
  typeSuccess: 'type-Success',
  typeDisabled: 'type-Disabled',
  stopAnimateMoveX: 'stop-animate-move-x',
  stopAnimateMoveSuccess: 'stop-animate-move-success'
} as Record<TDClassIdType, string>


export const TicTacCell = (columnId: ColumnIdType, firstTime: boolean, turn: TurnType, changeTurn: ChangeFunctionType, contextData: InitializeContextsFunctionType) => {
  let clicked = false;

  const getMoveType = (): MovePositionType => {
    return columnId.replace('-', '') as MovePositionType
  }

  const setClicked = () => {
    clicked = true;
  }

  const setUnClicked = () => {
    clicked = false;
  }

  const removeAllNewClasses = (tdElement: HTMLDivElement) => {
    Object.keys(tdClassList).map((keyname: string | TDClassIdType) => {
      const className = tdClassList[keyname as TDClassIdType];
      if (tdElement.classList.contains(className)) {
        tdElement.classList.remove(className);
      }
    });
  }

  const onClick = (appliedTurn: TurnType, appliedChangeTurn: ChangeFunctionType, e: Event) => {
    if (!clicked) {
      (e.target as HTMLDivElement).classList.add('type-' + appliedTurn);
      const cv = TicTacCellValue( appliedTurn );
      (e.target as HTMLDivElement).append(cv.render());
      setClicked();
      appliedChangeTurn(getMoveType());
    } else {
      (e.target as HTMLDivElement).classList.add(tdClassList.typeError);
      setTimeout(() => {
        (e.target as HTMLDivElement).classList.remove(tdClassList.typeError);
      }, 200);
    }
  }

  const anotherPersonMove = (newElement: HTMLDivElement) => {
    newElement.classList.add(tdClassList.typeX);
    setTimeout(() => {
      newElement.classList.add(tdClassList.stopAnimateMoveX);
    }, StopAnimateMoveX);
    const cv = TicTacCellValue( turnData.anotherTurn );
    newElement.append(cv.render());
    setClicked();
  }

  const reset = ( newTurn: TurnType, newChangeTurn: ChangeFunctionType ) => {
    const element = findEl('#column-' + columnId);
    // @ts-ignore
    const cv = document.querySelector('#column-' + columnId+' > .tic-tac-cell-value');
    if ( cv !== null ) {
      cv.remove();
    }
    // Clone the element
    const newElement = element.cloneNode(true) as HTMLDivElement;
    // Replace the original element with the clone
    // @ts-ignore
    element.parentNode.replaceChild(newElement, element);
    newElement.addEventListener('click', onClick.bind(null, newTurn, newChangeTurn));
    removeAllNewClasses(newElement);
    setUnClicked();
    resetStopAnimateMoveSuccess();
  }

  const update = (newTurn: TurnType, newChangeTurn: ChangeFunctionType) => {
    const { getAnotherPlayerTurns } = useContextTurnStorage(contextData);
    const { getWinnerSequence } = useContextWinnerSeq(contextData);
    const anotherPersonMoves = getAnotherPlayerTurns();
    const winnerSequence = getWinnerSequence();
    const element = findEl('#column-' + columnId);

    // Clone the element
    const newElement = element.cloneNode(true) as HTMLDivElement;

    // Replace the original element with the clone
    // @ts-ignore
    element.parentNode.replaceChild(newElement, element);

    // console.log('anotherPersonTurns', anotherPersonTurns);
    if (Array.isArray(anotherPersonMoves) && winnerSequence === null) {
      if (
        !anotherPersonMoves.includes(getMoveType())
      ) {
        newElement.addEventListener('click', onClick.bind(null, newTurn, newChangeTurn));
      } else if (!newElement.classList.contains(tdClassList.typeX)) {
        anotherPersonMove(newElement);
      }
    } else {
      if (winnerSequence === null) {
        newElement.addEventListener('click', onClick.bind(null, newTurn, newChangeTurn));
      } else if (Array.isArray(winnerSequence)) {
        if (winnerSequence.includes(getMoveType())) {
          setTimeout(() => {
            newElement.classList.add(tdClassList.typeSuccess);
            setTimeout(() => {
              newElement.classList.add(tdClassList.stopAnimateMoveSuccess);
            }, 200);
          }, getStopAnimateMoveSuccess());
          incrementStopAnimateMoveSuccess();
          if (
            Array.isArray(anotherPersonMoves)
            && anotherPersonMoves.includes(getMoveType())
            && !newElement.classList.contains(tdClassList.typeX)
          ) {
            anotherPersonMove(newElement);
          }
        } else {
          newElement.classList.add(tdClassList.typeDisabled);
        }
      }
    }
  }

  const render = () => {
    const id = TicTacCellIdentifier(columnId, firstTime);
    const td = document.createElement('div');
    td.setAttribute('id', 'column-' + columnId);
    td.classList.add('tic-tac-cell');
    td.append(id.render());
    if ( isItRemoteGame(contextData) && isItRemotePlayerTurn(contextData) ) {
      td.classList.add(tdClassList.typeDisabled);
    } else {
      td.addEventListener('click', onClick.bind(null, turn, changeTurn) );
    }
    // console.log('event listener added', 'column-'+columnId)
    return td;
  }

  return {
    render,
    update,
    reset
  };
}

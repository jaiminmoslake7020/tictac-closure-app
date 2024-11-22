import {
  MoveType,
  MoveTypeWithNull,
  TurnStorageType,
  TurnType,
  WiningSequenceType,
  WiningSequenceTypeWithNull,
  WinnerType
} from '../types/index.js';

const winnerData = [
  ['11', '22', '33'],
  ['13', '22', '31'],

  ['11', '12', '13'],
  ['21', '22', '23'],
  ['31', '32', '33'],

  ['11', '21', '31'],
  ['12', '22', '32'],
  ['13', '23', '33'],
] as WiningSequenceType[];

const allData = [
  '11', '12', '13',
  '21', '22', '23',
  '31', '32', '33',
] as MoveType[];

const singlePlayer = false as Boolean;

export const whenOneInSequence = (
  seq: WiningSequenceType,
  currentValues: MoveType[],
  anotherCurrentValues: MoveType[],
) => {
  let foundAnotherMove = null;
  if (
    ( currentValues.includes( seq[0] ) && !anotherCurrentValues.includes( seq[1] ) && !anotherCurrentValues.includes( seq[2] ) )
  ) {
    if ( seq[0] === "11" || seq[0] === "13"  ) {
      foundAnotherMove = seq[1];
    } else {
      foundAnotherMove = seq[2];
    }
  } else  if (
    ( currentValues.includes( seq[1] ) && !anotherCurrentValues.includes( seq[2] ) && !anotherCurrentValues.includes( seq[0] ) )
  ) {
    foundAnotherMove = seq[2];
  } else  if (
    ( currentValues.includes( seq[2] ) && !anotherCurrentValues.includes( seq[0] ) && !anotherCurrentValues.includes( seq[1] ) )
  ) {
    if ( seq[0] === "33" || seq[0] === "31"  ) {
      foundAnotherMove = seq[1];
    } else {
      foundAnotherMove = seq[0];
    }
  }
  console.log("whenOneInSequence", foundAnotherMove);
  // console.log('currentValues', currentValues, seq, anotherCurrentValues, foundAnotherMove);
  return foundAnotherMove;
}

export const TurnHandler = () => {
  let turn = 'O'  as TurnType;
  let anotherTurn = 'X' as TurnType;
  let winner = null as WinnerType ;
  let winnerSequence = null as WiningSequenceTypeWithNull ;
  let turnStorage = {} as TurnStorageType;

  const checkWinner = () => {
    if (!winner) {
      let foundWinner = null as WinnerType;
      const keys = Object.keys(turnStorage);
      let keysStartAt = 0 ;
      while( keysStartAt < keys.length ) {
        const currentValues = turnStorage[ keys[keysStartAt] as TurnType ];
        if (currentValues.length >= 3) {
          let startAt = 0 ;
          while (startAt < winnerData.length) {
            const seq = winnerData[startAt] as WiningSequenceType;
            if (currentValues.includes( seq[0] ) && currentValues.includes( seq[1] ) && currentValues.includes( seq[2] )) {
              foundWinner = keys[keysStartAt] as TurnType;
              winnerSequence = seq;
              break;
            }
            startAt++;
          }
        }
        if (foundWinner !== null) {
          break;
        }
        keysStartAt++;
      }
      if (foundWinner) {
        winner = foundWinner;
      }
    }
  }

  const findAnotherEasy = () : MoveType => {
    const keys = Object.keys(turnStorage);
    let keysStartAt = 0 ;
    let totalValues = [] as MoveType[];
    while( keysStartAt < keys.length ) {
      const currentValues = turnStorage[ keys[keysStartAt] as TurnType ];
      totalValues = [...totalValues, ...currentValues];
      keysStartAt++;
    }
    const remainingMoves = allData.filter(v => !totalValues.includes(v));
    // console.log('remainingMoves', remainingMoves, allData, totalValues);
   //  console.log('foundAnotherMove V1 Random ');
    return remainingMoves[  Math.floor(Math.random() * ( remainingMoves.length - 1 )) ];
  }

  const findAnotherMedium = () : MoveType => {
    let foundWinner = null as WinnerType;
    let foundAnotherMove = null as MoveTypeWithNull;

    const currentValues = turnStorage[ turn ];
    const anotherCurrentValues = turnStorage[ anotherTurn ] || [];
    if (currentValues.length > 1) {
      let startAt = 0 ;
      while (startAt < winnerData.length) {
        const seq = winnerData[startAt];
        if (
          !( currentValues.includes( seq[0] ) && currentValues.includes( seq[1] ) && currentValues.includes( seq[2] ) )
        ) {
          if (foundAnotherMove === null) {
            if (
              ( currentValues.includes( seq[0] ) && currentValues.includes( seq[1] ) && !anotherCurrentValues.includes( seq[2] ) )
            ) {
              foundAnotherMove = seq[2];
            } else  if (
              ( currentValues.includes( seq[1] ) && currentValues.includes( seq[2] ) && !anotherCurrentValues.includes( seq[0] ) )
            ) {
              foundAnotherMove = seq[0];
            } else  if (
              ( currentValues.includes( seq[0] ) && currentValues.includes( seq[2] ) && !anotherCurrentValues.includes( seq[1] ) )
            ) {
              foundAnotherMove = seq[1];
            }
          }
        } else {
          foundWinner = turn;
          winnerSequence = seq;
          foundAnotherMove = null;
          break;
        }
        startAt++;
      }
    } else {
      let startAt = 0 ;
      while (startAt < winnerData.length) {
        const seq = winnerData[startAt];
        foundAnotherMove = whenOneInSequence(seq, currentValues, anotherCurrentValues);
        if (foundAnotherMove !== null) {
          break;
        }
        startAt++;
      }
    }

    // console.log('foundAnotherMove with V2 ', foundAnotherMove , foundWinner);
    if (foundWinner) {
      winner = foundWinner;
    } else if (foundAnotherMove === null) {
      foundAnotherMove = findAnotherEasy();
    }

    return foundAnotherMove as MoveType;
  }

  const findAnotherHard = () : MoveType | undefined => {
    let foundWinner = null as WinnerType;
    let foundAnotherMove = null as MoveTypeWithNull;

    const currentValues = turnStorage[ turn ];
    const anotherCurrentValues = turnStorage[ anotherTurn ] || [];
    if (currentValues.length + anotherCurrentValues.length === 9) {
      return undefined;
    }

    if (anotherCurrentValues.length >= 2) {
      let startAt = 0 ;
      while (startAt < winnerData.length) {
        const seq = winnerData[startAt];
        if (
          !( currentValues.includes( seq[0] ) && currentValues.includes( seq[1] ) && currentValues.includes( seq[2] ) )
        ) {
          if (foundAnotherMove === null) {
            if (
              ( anotherCurrentValues.includes( seq[0] ) && anotherCurrentValues.includes( seq[1] ) && !currentValues.includes( seq[2] ) )
            ) {
              foundAnotherMove = seq[2];
              foundWinner = anotherTurn;
              winnerSequence = seq;
              break;
            } else  if (
              ( anotherCurrentValues.includes( seq[1] ) && anotherCurrentValues.includes( seq[2] ) && !currentValues.includes( seq[0] ) )
            ) {
              foundAnotherMove = seq[0];
              foundWinner = anotherTurn;
              winnerSequence = seq;
              break;
            } else  if (
              ( anotherCurrentValues.includes( seq[2] ) && anotherCurrentValues.includes( seq[0] ) && !currentValues.includes( seq[1] ) )
            ) {
              foundAnotherMove = seq[1];
              foundWinner = anotherTurn;
              winnerSequence = seq;
              break;
            }
          }
        } else {
          foundWinner = turn;
          winnerSequence = seq;
          foundAnotherMove = null;
          break;
        }
        startAt++;
      }
    }

    // console.log('foundAnotherMove with V3 ', foundAnotherMove , foundWinner);
    if (foundWinner) {
      winner = foundWinner;
    } else if (foundAnotherMove === null) {
      foundAnotherMove = findAnotherMedium();
    }

    return foundAnotherMove as MoveType;
  }

  const changeTurn = (v :  MoveType) => {
    if ( singlePlayer ) {
      if (turnStorage[turn]) {
        turnStorage[turn].push(v);
      } else {
        turnStorage[turn] = [v];
      }
      if (turn === "O") {
        turn = 'X';
      } else {
        turn = 'O';
      }
      checkWinner();
    } else {
      if (turnStorage[turn]) {
        turnStorage[turn].push(v);
      } else {
        turnStorage[turn] = [v];
      }
      checkWinner();
      if ( winner === null ) {
        const nextMove = findAnotherEasy();
        if (nextMove) {
          if (turnStorage[anotherTurn]) {
            turnStorage[anotherTurn].push(nextMove);
          } else {
            turnStorage[anotherTurn] = [nextMove];
          }
        }
        checkWinner();
      }
      // console.log( [...turnStorage[turn], ...turnStorage[anotherTurn]] );
      if ([...turnStorage[turn], ...turnStorage[anotherTurn]].length === 9 && winner === null) {
        winner = 'NONE';
      }
    }
  }

  const getTurn = () : TurnType => {
    return turn;
  }

  const getWinner = () : WinnerType => {
    return winner;
  }

  const getWinnerSequence = () : WiningSequenceTypeWithNull => {
    return winnerSequence;
  }

  const getAnotherPersonTurns = () : MoveType[] | null => {
    return !singlePlayer ? ( turnStorage[anotherTurn] || [] ) : null;
  }

  return {
    turn, changeTurn, getTurn, getWinner, getWinnerSequence, getAnotherPersonTurns
  }
}

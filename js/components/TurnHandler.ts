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

export const TurnHandler = () => {
  let turn = 'O'  as TurnType;
  let anotherTurn = 'X' as TurnType;
  let winner = null as WinnerType ;
  let winnerSequence = null as WiningSequenceTypeWithNull ;
  let turnStorage = {} as TurnStorageType;

  const checkWinner = () => {
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

  const findAnotherV = () : MoveType => {
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
    return remainingMoves[  Math.floor(Math.random() * ( remainingMoves.length - 1 )) ];
  }

  const findAnotherV2 = () : MoveType => {
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
        }
        startAt++;
      }
    } else {
      let startAt = 0 ;
      while (startAt < winnerData.length) {
        const seq = winnerData[startAt];
        if (
          ( currentValues.includes( seq[0] ) && !anotherCurrentValues.includes( seq[1] ) && !anotherCurrentValues.includes( seq[2] ) )
        ) {
          foundAnotherMove = seq[2];
          break;
        } else  if (
          ( currentValues.includes( seq[1] ) && !anotherCurrentValues.includes( seq[2] ) && !anotherCurrentValues.includes( seq[0] ) )
        ) {
          foundAnotherMove = seq[0];
          break;
        } else  if (
          ( currentValues.includes( seq[0] ) && !anotherCurrentValues.includes( seq[2] ) && !anotherCurrentValues.includes( seq[1] ) )
        ) {
          foundAnotherMove = seq[1];
          break;
        }
        startAt++;
      }
    }

    if (foundWinner) {
      winner = foundWinner;
    } else if (foundAnotherMove === null) {
      foundAnotherMove = findAnotherV();
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
      const nextMove = findAnotherV2();
      if (turnStorage[anotherTurn]) {
        turnStorage[anotherTurn].push(nextMove);
      } else {
        turnStorage[anotherTurn] = [nextMove];
      }
      console.log('turnStorage', turnStorage);
      checkWinner();
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

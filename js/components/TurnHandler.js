const winnerData = [
  ['11', '12', '13'],
  ['21', '22', '23'],
  ['31', '32', '33'],

  ['11', '21', '31'],
  ['12', '22', '32'],
  ['13', '23', '33'],

  ['11', '22', '33'],
  ['13', '22', '31'],
];

const allData = [
  '11', '12', '13',
  '21', '22', '23',
  '31', '32', '33',
];

const singlePlayer = false;

export const TurnHandler = () => {
  let turn = 'O';
  let anotherTurn = 'X';
  let winner = null;
  let winnerSequence = null;

  let turnStorage = {};

  const checkWinner = () => {
    let foundWinner = null
    const keys = Object.keys(turnStorage);
    let keysStartAt = 0 ;
    while( keysStartAt < keys.length ) {
      const currentValues = turnStorage[ keys[keysStartAt] ];
      if (currentValues.length >= 3) {
        let startAt = 0 ;
        while (startAt < winnerData.length) {
          const seq = winnerData[startAt];
          if (currentValues.includes( seq[0] ) && currentValues.includes( seq[1] ) && currentValues.includes( seq[2] )) {
            foundWinner = keys[keysStartAt];
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

  const findAnotherV = () => {
    const keys = Object.keys(turnStorage);
    let keysStartAt = 0 ;
    let totalValues = [];
    while( keysStartAt < keys.length ) {
      const currentValues = turnStorage[ keys[keysStartAt] ];
      totalValues = [...totalValues, ...currentValues,];
      keysStartAt++;
    }
    const remainingMoves = allData.filter(v => !totalValues.includes(v));
    // console.log('remainingMoves', remainingMoves, allData, totalValues);
    return remainingMoves[  Math.floor(Math.random() * ( remainingMoves.length - 1 )) ];
  }

  const findAnotherV2 = () => {
    let foundWinner = null;
    let foundAnotherMove = null;

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

    return foundAnotherMove;
  }

  const changeTurn = (v) => {
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

  const getTurn = () => {
    return turn;
  }

  const getWinner = () => {
    return winner;
  }

  const getWinnerSequence = () => {
    return winnerSequence;
  }

  const getAnotherPersonTurns = () => {
    return !singlePlayer ? ( turnStorage[anotherTurn] || [] ) : null;
  }

  return {
    turn, changeTurn, getTurn, getWinner, getWinnerSequence, getAnotherPersonTurns
  }
}

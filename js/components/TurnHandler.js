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

export const TurnHandler = () => {
  let turn = 'O';
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
          // console.log('seq', seq, currentValues);
          if (currentValues.includes( seq[0] ) && currentValues.includes( seq[1] ) && currentValues.includes( seq[2] )) {
            foundWinner = keys[keysStartAt];
            winnerSequence = seq;
            // console.log('foundWinner', foundWinner)
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

  const changeTurn = (v) => {
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
    console.log('turnStorage', turnStorage);
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

  return {
    turn, changeTurn, getTurn, getWinner, getWinnerSequence
  }
}

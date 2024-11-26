import {
  AppLevelType,
  MoveType,
  MoveTypeWithNull,
  TurnStorageType,
  TurnType,
  WiningSequenceType,
  WiningSequenceTypeWithNull,
  WinnerType
} from '../types/index.js';
import { appLevelList } from '../helpers/index.js';

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
  // console.log("whenOneInSequence", foundAnotherMove);
  // console.log('currentValues', currentValues, seq, anotherCurrentValues, foundAnotherMove);
  return foundAnotherMove;
}

const checkWinner = (
  turnStorage: TurnStorageType,
  setWinnerSequence: ( v: WiningSequenceType ) =>  void,
  setWinner: ( v: WinnerType ) => void,
  winner: WinnerType | null
) => {
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
            setWinnerSequence( seq );
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
      setWinner( foundWinner );
    }
  }
}

const findAnotherEasy = (
  turnStorage: TurnStorageType,
) : MoveType => {
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

const findAnotherMedium = (
  turnStorage: TurnStorageType,
  turn: TurnType,
  anotherTurn: TurnType,
  setWinnerSequence: ( v: WiningSequenceType ) =>  void,
  setWinner: ( v: WinnerType ) => void
) : MoveType => {
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
        setWinnerSequence( seq );
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
    setWinner( foundWinner );
  } else if (foundAnotherMove === null) {
    foundAnotherMove = findAnotherEasy(
      turnStorage
    );
  }

  return foundAnotherMove as MoveType;
}

const findAnotherHard = (
  turnStorage: TurnStorageType,
  turn: TurnType,
  anotherTurn: TurnType,
  setWinnerSequence: ( v: WiningSequenceType ) =>  void,
  setWinner: ( v: WinnerType ) => void
) : MoveType | undefined => {
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
            setWinnerSequence( seq );
            break;
          } else  if (
            ( anotherCurrentValues.includes( seq[1] ) && anotherCurrentValues.includes( seq[2] ) && !currentValues.includes( seq[0] ) )
          ) {
            foundAnotherMove = seq[0];
            foundWinner = anotherTurn;
            setWinnerSequence( seq );
            break;
          } else  if (
            ( anotherCurrentValues.includes( seq[2] ) && anotherCurrentValues.includes( seq[0] ) && !currentValues.includes( seq[1] ) )
          ) {
            foundAnotherMove = seq[1];
            foundWinner = anotherTurn;
            setWinnerSequence( seq );
            break;
          }
        }
      } else {
        foundWinner = turn;
        setWinnerSequence( seq );
        foundAnotherMove = null;
        break;
      }
      startAt++;
    }
  }

  // console.log('foundAnotherMove with V3 ', foundAnotherMove , foundWinner);
  if (foundWinner) {
    setWinner( foundWinner );
  } else if (null === foundAnotherMove) {
    foundAnotherMove = findAnotherMedium(
      turnStorage,
      turn,
      anotherTurn,
      setWinnerSequence,
      setWinner
    );
  }

  return foundAnotherMove as MoveType;
}


export type useWinnerHookType = {
  getWinner: () => WinnerType,
  setWinner: (v: WinnerType) => void
};

export const useWinnerHook = () : useWinnerHookType => {
  let winner = null as WinnerType ;

  const setWinner = (v:WinnerType) => {
    winner = v;
  }

  const getWinner = () => {
    return winner;
  }

  return {
    getWinner, setWinner
  };
}


export type useWinnerSeqHookType = {
  getWinnerSequence: () => WiningSequenceTypeWithNull,
  setWinnerSequence: (v: WiningSequenceTypeWithNull) => void
};

export const useWinnerSeqHook = () : useWinnerSeqHookType => {
  let winnerSequence = null as WiningSequenceTypeWithNull ;

  const setWinnerSequence = (v:WiningSequenceTypeWithNull) => {
    winnerSequence = v;
  }

  const getWinnerSequence = () => {
    return winnerSequence;
  }

  return {
    getWinnerSequence, setWinnerSequence
  };
}

export type useTurnStorageHookType = {
  getTurnStorage: () => TurnStorageType,
  addNewTurn: (move: MoveType, turn: TurnType) => void
};

export const useTurnStorageHook = () : useTurnStorageHookType => {
  let turnStorage = {} as TurnStorageType;

  const setTurnStorage = (v:TurnStorageType) => {
    turnStorage = v;
  }

  const getTurnStorage = () => {
    return turnStorage;
  }

  const addNewTurn = (
    move: MoveType,
    turn: TurnType
  ) => {
    if (turnStorage[turn]) {
      setTurnStorage( {...turnStorage, [turn]: [ ...turnStorage[turn] ,move]} );
    } else {
      setTurnStorage( {...turnStorage, [turn]: [move]} );
    }
  }

  return {
    getTurnStorage, addNewTurn
  };
}


export const TurnHandler = ( appLevel: AppLevelType ) => {
  let turn = 'O'  as TurnType;
  let anotherTurn = 'X' as TurnType;
  // let turnStorage = {} as TurnStorageType;

  const {
    getWinner, setWinner
  } = useWinnerHook();

  const {
    getWinnerSequence, setWinnerSequence
  } = useWinnerSeqHook();

  const {
    getTurnStorage, addNewTurn
  } = useTurnStorageHook();

  const changeTurn = (v :  MoveType) => {
    if ( singlePlayer ) {
      addNewTurn(v, turn);
      turn = turn === "O" ? "X" : "O"
      checkWinner(
        getTurnStorage(),
        setWinnerSequence,
        setWinner,
        getWinner()
      );
    } else {
      addNewTurn(v, turn);
      checkWinner(
        getTurnStorage(),
        setWinnerSequence,
        setWinner,
        getWinner()
      );
      if ( getWinner() === null ) {
        let nextMove;
        if ( appLevel === appLevelList.easy ) {
          nextMove = findAnotherEasy(
            getTurnStorage(),
          );
        } else if (
          appLevel === appLevelList.medium
        ) {
          nextMove = findAnotherMedium(
            getTurnStorage(),
            turn,
            anotherTurn,
            setWinnerSequence,
            setWinner
          );
        } else {
          nextMove = findAnotherHard(
            getTurnStorage(),
            turn,
            anotherTurn,
            setWinnerSequence,
            setWinner
          );
        }
        if (nextMove) {
          addNewTurn(nextMove, anotherTurn);
        }
        checkWinner(
          getTurnStorage(),
          setWinnerSequence,
          setWinner,
          getWinner()
        );
      }
      if ([...getTurnStorage()[turn], ...getTurnStorage()[anotherTurn]].length === 9 && getWinner() === null) {
        setWinner( 'NONE' );
      }
    }
  }

  const getTurn = () : TurnType => {
    return turn;
  }

  const getAnotherPersonTurns = () : MoveType[] | null => {
    return !singlePlayer ? ( getTurnStorage()[anotherTurn] || [] ) : null;
  }

  const printData = () => {
    console.log('turnStorage', getTurnStorage());
  }

  return {
    turn, changeTurn, getTurn, getWinner, getWinnerSequence, getAnotherPersonTurns, printData
  }
}

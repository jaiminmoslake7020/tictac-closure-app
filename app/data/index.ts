import {MovePositionType, TurnType, WiningSequenceType} from '@types-dir/index';

export const winnerData = [
  ['11', '22', '33'],
  ['13', '22', '31'],

  ['11', '12', '13'],
  ['21', '22', '23'],
  ['31', '32', '33'],

  ['11', '21', '31'],
  ['12', '22', '32'],
  ['13', '23', '33'],
] as WiningSequenceType[];

export const allData = [
  '11', '12', '13',
  '21', '22', '23',
  '31', '32', '33',
] as MovePositionType[];

export const turnData = {
  turn: 'O' as TurnType,
  anotherTurn: 'X' as TurnType
} as {
  'turn': TurnType,
  'anotherTurn': TurnType
};

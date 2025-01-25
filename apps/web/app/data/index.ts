import {
  MovePositionType,
  OpponentFormButtonType,
  OpponentLabelType,
  OpponentType,
  TurnType,
  WiningSequenceType,
} from '@types-dir/index';

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
  '11',
  '12',
  '13',
  '21',
  '22',
  '23',
  '31',
  '32',
  '33',
] as MovePositionType[];

export const turnData = {
  turn: 'O' as TurnType,
  anotherTurn: 'X' as TurnType,
} as {
  turn: TurnType;
  anotherTurn: TurnType;
};

export const remoteRandomPlayer = 'remote-random-player' as OpponentType;
export const remoteFriendPlayer = 'remote-friend-player' as OpponentType;
export const computerProgram = 'computer-program' as OpponentType;
export const sameDevicePlay = 'same-device-play' as OpponentType;

export const opponentTypesObject = {
  [remoteRandomPlayer]: 'Remote Random Player',
  [remoteFriendPlayer]: 'Remote Friend Player',
  [computerProgram]: 'Computer Program',
  [sameDevicePlay]: 'Same Device Play',
} as Record<OpponentType, OpponentLabelType>;

export const opponentTypes = [
  remoteRandomPlayer,
  remoteFriendPlayer,
  computerProgram,
  sameDevicePlay,
] as OpponentType[];

export const opponentFormButtonTypeList = opponentTypes.map(
  (k: OpponentType) => ({
    label: opponentTypesObject[k],
    value: k,
  })
) as OpponentFormButtonType[];

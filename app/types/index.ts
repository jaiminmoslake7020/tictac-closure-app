export type AppLevelType = 'easy' | 'medium' | 'hard';

export type TurnType = 'X' | 'O' | string;
export type WinnerType = TurnType | null | 'NONE' | string;

export type MovePositionType = '11' | '12' | '13' | '21' | '22' | '23' | '31' | '32' | '33';
export type ColumnIdType = '1-1' | '1-2' | '1-3' | '2-1' | '2-2' | '2-3' | '3-1' | '3-2' | '3-3';
export type MovePositionTypeWithNull = MovePositionType | null;
export type WiningSequenceType = [MovePositionType, MovePositionType, MovePositionType];
export type WiningSequenceTypeWithNull = [MovePositionType, MovePositionType, MovePositionType] | null;
export type AnotherPersonMovePositionsType = MovePositionType[];
export type AnotherPersonMovePositionsTypeWithNull = MovePositionType[] | null;

export type TurnStorageType = Record<TurnType, MovePositionType[]>;

export type ChangeFunctionType = ( i: MovePositionType ) => void;
export type TicTacCellRowRenderFunctionType = () => HTMLDivElement
export type TicTacCellRowUpdateFunctionType = (newTurn: TurnType, newChangeTurn: ChangeFunctionType) => void

export type TicTacCellRowFunctionType = {
  render: TicTacCellRowRenderFunctionType,
  update: TicTacCellRowUpdateFunctionType,
  reset: ( newTurn: TurnType, newChangeTurn: ChangeFunctionType ) => void
}


export type TicTacCellRenderFunctionType = () => HTMLDivElement
export type TicTacCellUpdateFunctionType = (newTurn: TurnType, newChangeTurn: ChangeFunctionType) => void

export type TicTacCellFunctionType = {
  render: TicTacCellRenderFunctionType,
  update: TicTacCellUpdateFunctionType,
  reset: ( newTurn: TurnType, newChangeTurn: ChangeFunctionType ) => void
}

export type TicTacFunctionReturnType = {
  render: () => HTMLDivElement,
}

export type TurnHandlerType = {
  turn: TurnType,
  changeTurn: ChangeFunctionType,
  getTurn: () => TurnType,
  printData: () =>void
};

export type TicTacTableType = {
  render: () => HTMLDivElement,
  reset: () => void
}

export type TicTacCellValueType = {
  render: () => HTMLDivElement,
}

export type TDClassIdType = 'typeO' | 'typeX' | 'typeError' | 'typeSuccess' | 'typeDisabled' | 'stopAnimateMoveX' | 'stopAnimateMoveSuccess';

export type OpponentType = 'remote-random-player' | 'remote-friend-player' | 'computer-program' | 'same-device-play';
export type OpponentLabelType = 'Remote Random Player' | 'Remote Friend Player' | 'Computer Program' | 'Same Device Play';
export type PlayerType = {
  label: OpponentLabelType,
  value: OpponentType
};

export type RoomType = 'create-room' | 'join-room';
export type RoomLabelType = 'Create Room' | 'Join Room';
export type RoomObjectType = {
  label: RoomLabelType,
  value: RoomType
};

export type UserType = {
  id: string,
  username: string
};

export type RoomReadyResponseType = {
  anotherPlayer: UserType,
  currentMove: string
};

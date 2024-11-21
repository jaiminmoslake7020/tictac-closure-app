export type TurnType = 'X' | 'O';
export type WinnerType = TurnType | null;

export type MoveType = '11' | '12' | '13' | '21' | '22' | '23' | '31' | '32' | '33';
export type ColumnIdType = '1-1' | '1-2' | '1-3' | '2-1' | '2-2' | '2-3' | '3-1' | '3-2' | '3-3';
export type MoveTypeWithNull = MoveType | null;
export type WiningSequenceType = [MoveType, MoveType, MoveType];
export type WiningSequenceTypeWithNull = [MoveType, MoveType, MoveType] | null;
export type AnotherPersonMovesType = MoveType[];
export type AnotherPersonMovesTypeWithNull = MoveType[] | null;

export type TurnStorageType = Record<TurnType, MoveType[]>;

export type ChangeFunctionType = ( i: MoveType ) => void;
export type TicTacCellRowRenderFunctionType = () => HTMLTableRowElement
export type TicTacCellRowUpdateFunctionType = (newTurn: TurnType, newChangeTurn: ChangeFunctionType, winnerSequence: WiningSequenceTypeWithNull, anotherPersonMoves: AnotherPersonMovesTypeWithNull ) => void

export type TicTacCellRowFunctionType = {
  render: () => HTMLTableRowElement,
  update: (newTurn: TurnType, newChangeTurn: ChangeFunctionType, winnerSequence: WiningSequenceTypeWithNull, anotherPersonMoves: AnotherPersonMovesTypeWithNull ) => void
}


export type TicTacCellRenderFunctionType = () => HTMLTableCellElement
export type TicTacCellUpdateFunctionType = (newTurn: TurnType, newChangeTurn: ChangeFunctionType, winnerSequence: WiningSequenceTypeWithNull, anotherPersonMoves: AnotherPersonMovesTypeWithNull ) => void

export type TicTacCellFunctionType = {
  render: () => HTMLTableCellElement,
  update: (newTurn: TurnType, newChangeTurn: ChangeFunctionType, winnerSequence: WiningSequenceTypeWithNull, anotherPersonMoves: AnotherPersonMovesTypeWithNull ) => void
}

export type TicTacFunctionReturnType = {
  render: () => HTMLDivElement,
}

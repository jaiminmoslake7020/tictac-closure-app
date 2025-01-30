export type AppLevelType = 'easy' | 'medium' | 'hard';

export type TurnType = 'X' | 'O' | string;
export type WinnerType = TurnType | null | 'NONE' | string;

export type MovePositionType =
  | '11'
  | '12'
  | '13'
  | '21'
  | '22'
  | '23'
  | '31'
  | '32'
  | '33';
export type ColumnIdType =
  | '1-1'
  | '1-2'
  | '1-3'
  | '2-1'
  | '2-2'
  | '2-3'
  | '3-1'
  | '3-2'
  | '3-3';
export type MovePositionTypeWithNull = MovePositionType | null;
export type WiningSequenceType = [
  MovePositionType,
  MovePositionType,
  MovePositionType,
];
export type WiningSequenceTypeWithNull =
  | [MovePositionType, MovePositionType, MovePositionType]
  | null;
export type AnotherPersonMovePositionsType = MovePositionType[];
export type AnotherPersonMovePositionsTypeWithNull = MovePositionType[] | null;

export type TurnStorageType = Record<TurnType, MovePositionType[]>;

export type ChangeFunctionType = (i: MovePositionType) => Promise<void>;

export type TurnHandlerType = {
  turn: TurnType;
  changeTurn: ChangeFunctionType;
  getTurn: () => TurnType;
  printData: () => void;
};

export type TDClassIdType =
  | 'typeO'
  | 'typeX'
  | 'typeError'
  | 'typeSuccess'
  | 'typeDisabled'
  | 'stopAnimateMoveX'
  | 'stopAnimateMoveSuccess';

export type OpponentType =
  | 'remote-random-player'
  | 'remote-friend-player'
  | 'computer-program'
  | 'same-device-play'
  | 'openai-chat-gpt';
export type OpponentLabelType =
  | 'Remote Random Player'
  | 'Remote Friend Player'
  | 'Computer Program'
  | 'Same Device Play'
  | 'OpenAi Chat-GPT';
export type OpponentFormButtonType = {
  label: OpponentLabelType;
  value: OpponentType;
};

export type RoomType = 'create-room' | 'join-room';
export type RoomLabelType = 'Create Room' | 'Join Room';
export type RoomObjectType = {
  label: RoomLabelType;
  value: RoomType;
};

export type UserType = {
  id: string;
  username: string;
};

export type GamePlayerType = 'creator' | 'joiner';
export type RoomReadyResponseType = {
  roomCode: string;
  anotherPlayer: UserType;
  playerType: GamePlayerType;
};

export type RoomExitedResponseType = {
  exitedBy: string;
};

export type FirebaseUserType = {
  username: string;
  live?: number;
  activeSession?: boolean;
  uid?: string;
};

export type FirebaseTurnStorageType = {
  position: MovePositionType;
  userId: string;
  id?: MovePositionType;
};

export type FirebaseGameType = {
  currentMove: string;
  time: number;
  creator_last_active_time: number;
  joiner_last_active_time: number;
  winner?: string;
  creator?: string;
  turnStorage?: Record<MovePositionType, FirebaseTurnStorageType>;
};

export type FirebaseGameTypeDocumentReference = {
  id: string;
  data: () => FirebaseGameType;
};

export type FirebasePlayerType = {
  id: string;
  username: string;
};

export type FirebaseRoomType = {
  creator: FirebasePlayerType;
  joiner?: FirebasePlayerType;
  creator_last_visit?: number;
  joiner_last_visit?: number;
  games?: Record<string, FirebaseGameType>;
};

export type FirebaseAppModelType = {
  rooms: Record<string, FirebaseRoomType>;
  users: Record<string, FirebaseUserType>;
};

export type WaitingRoomDbItemType = {
  id: string;
  live: number;
  username: string;
  gameId?: string;
  roomId?: string;
  playerType?: GamePlayerType;
};

export type ChatGptErrorObjectType =
  | 'ERROR'
  | 'ERROR_USED_MOVE'
  | 'ERROR_INVALID_MOVE'
  | 'ERROR_WON_GAME_PREDICATION';

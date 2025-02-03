import OpenAI from 'openai';

export type UserType = {
  id: string;
  live: number;
};

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

export type MovePositionTypeChatGpt =
  | '00'
  | '01'
  | '02'
  | '10'
  | '11'
  | '12'
  | '20'
  | '21'
  | '22';

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
  chatGptConversation?: string[];
  userPrompt: string[];
  turnStorage?: Record<MovePositionType, FirebaseTurnStorageType>;
};

export type FirebaseGameTypeDocumentReference = {
  id: string;
  data: () => FirebaseGameType;
};

export type WaitingRoomDbItemType = {
  id: string;
  live: number;
  username: string;
  gameId?: string;
  roomId?: string;
};

export type FirebasePlayerType = {
  id: string;
  username: string;
};

export type FirebaseUserType = {
  username: string;
  live?: number;
  activeSession?: boolean;
  uid?: string;
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
  'waiting-room': Record<string, FirebaseUserType>;
};

export type TurnStorageType = {
  id: string;
  userId: string;
  position: MovePositionType;
  numberOfTurnsMade: number;
};

export type MatrixCellType = 'Player' | 'OpenAI' | 'NULL';

export type MatrixType = [
  [MatrixCellType, MatrixCellType, MatrixCellType],
  [MatrixCellType, MatrixCellType, MatrixCellType],
  [MatrixCellType, MatrixCellType, MatrixCellType],
];

export type ChatCompletionMessageType =
  OpenAI.Chat.Completions.ChatCompletionMessageParam;

export type JsonConvertedResponseType = {
  move: MovePositionTypeChatGpt;
  game_board: MatrixType;
};

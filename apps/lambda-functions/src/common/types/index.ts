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
  chatGptConversation?: string;
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
  "waiting-room": Record<string, FirebaseUserType>;
};


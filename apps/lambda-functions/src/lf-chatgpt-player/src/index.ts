import {askChatGptToMakeMove} from './service';

export const handler = async (roomCode: string, gameId: string) => {
  return await askChatGptToMakeMove(roomCode, gameId);
};

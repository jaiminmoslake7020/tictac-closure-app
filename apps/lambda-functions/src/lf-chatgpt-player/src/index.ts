import {askChatGptToMakeMove} from './service';

export const handler = async (roomCode: string, gameId: string) => {
  if (roomCode && gameId) {
    return await askChatGptToMakeMove(roomCode, gameId);
  } else {
    throw new Error('Invalid Room and Game');
  }
};

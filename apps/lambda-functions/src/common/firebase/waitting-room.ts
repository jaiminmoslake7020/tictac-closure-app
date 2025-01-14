import { updateDocument } from './core';

export const updateWaitingRoomUser = async (
  id: string,
  gameId: string,
  roomId: string,
  playerType: 'creator' | 'joiner',
): Promise<void> => {
  await updateDocument(`waiting-room/${id}`, {
    gameId,
    roomId,
    playerType,
  });
};

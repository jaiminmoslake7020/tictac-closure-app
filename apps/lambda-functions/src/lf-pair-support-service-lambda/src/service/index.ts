import { UserType, WaitingRoomDbItemType } from '../../../common/types';
import { fetchAllDocuments } from '../../../common/firebase/core';
import { isAlive } from '../../../common/utils';
import { createRoom } from '../../../common/firebase/room';
import { createGameForRoomJoiner } from '../../../common/firebase/game';
import { updateWaitingRoomUser } from '../../../common/firebase/waitting-room';

export const initiatePair = async (pair: [UserType, UserType]) => {
  const [roomCreator, roomJoiner] = pair;
  const roomCodeId = await createRoom(roomCreator, roomJoiner);
  if (roomCodeId) {
    console.log('Room created:', roomCodeId);
    const gameId = await createGameForRoomJoiner(
      roomCodeId,
      roomCreator,
      roomJoiner,
    );
    if (gameId && roomCodeId) {
      await updateWaitingRoomUser(
        roomCreator.id,
        gameId,
        roomCodeId,
        'creator',
      );
      await updateWaitingRoomUser(roomJoiner.id, gameId, roomCodeId, 'joiner');
    } else {
      console.error('Error creating game for room joiner');
    }
  } else {
    console.error('Error creating room');
  }
};

export const processPairs = async (aliveUsers: UserType[]) => {
  if (aliveUsers.length >= 2) {
    const [firstUser, secondUser, ...rest] = aliveUsers;
    console.log('Pair User:', firstUser, secondUser);
    await initiatePair([firstUser, secondUser]);
    if (Array.isArray(rest)) {
      await processPairs(rest);
    }
  }
};

export const filterAliveUsers = (
  data: WaitingRoomDbItemType[],
): WaitingRoomDbItemType[] => {
  return data.filter((doc) => {
    const { live, gameId, roomId } = doc;
    return isAlive(live) && !gameId && !roomId;
  });
};

export const makePairs = async () => {
  // Fetch all documents
  const data = (await fetchAllDocuments(
    'waiting-room',
  )) as WaitingRoomDbItemType[];
  const aliveUsers = filterAliveUsers(data);
  await processPairs(aliveUsers);
};

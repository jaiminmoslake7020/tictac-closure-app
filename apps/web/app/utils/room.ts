import { FirebaseRoomType } from '@types-dir/index';
import { getCurrentTime } from '@utils/index';

export const isRoomReady = (room: FirebaseRoomType): boolean => {
  const { creator, joiner, creator_last_visit, joiner_last_visit } = room;
  if (creator && joiner && creator_last_visit && joiner_last_visit) {
    const diffCreator = getCurrentTime() - creator_last_visit;
    const diffJoiner = getCurrentTime() - joiner_last_visit;
    return diffCreator < 15000 && diffJoiner < 15000;
  }
  return false;
};

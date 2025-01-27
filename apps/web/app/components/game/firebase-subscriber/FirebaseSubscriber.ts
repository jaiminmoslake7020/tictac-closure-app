import { IsGameAvailableSubscriber } from '@components/game/opponent-selection/remote-friend-player/IsGameAvailableSubscriber';
import { UpdateLastActiveTimeSubscriber } from '@components/game/opponent-selection/remote-friend-player/UpdateLastActiveTimeSubscriber';
import { InitializeContextsFunctionType } from '@contexts/index';
import { GameActionCallbacksType } from '@components/game/GameActions';

export type FirebaseSubscriberType = {
  addSubscribers: () => Promise<void>;
  removeSubscribers: () => Promise<void>;
};

export const FirebaseSubscriber = (
  contextsData: InitializeContextsFunctionType,
  gameActionsObject: GameActionCallbacksType
) => {
  // console.log('addGameAvailableSubscriber');
  const { isGameAvailableSubscriber, removeGameAvailableSubscriber } =
    IsGameAvailableSubscriber(contextsData, gameActionsObject);

  // console.log('updateGameSubscriber');
  const { updateGameIsActiveSubscriber, removeUpdateGameIsActiveSubscriber } =
    UpdateLastActiveTimeSubscriber(contextsData, gameActionsObject);

  const addSubscribers = async () => {
    await isGameAvailableSubscriber();
    await updateGameIsActiveSubscriber();
  };

  const removeSubscribers = async () => {
    await removeGameAvailableSubscriber();
    await removeUpdateGameIsActiveSubscriber();
  };

  return {
    addSubscribers,
    removeSubscribers,
  };
};

export const FirebaseSubscriberInitiator = () => {
  let hasSubscriber = false;
  let subscriber: FirebaseSubscriberType | null;

  const startSubscribers = async (
    contextsData: InitializeContextsFunctionType,
    gameActionsObject: GameActionCallbacksType
  ) => {
    if (!hasSubscriber && !subscriber) {
      // console.log('startSubscribers')
      subscriber = FirebaseSubscriber(contextsData, gameActionsObject);
      await subscriber.addSubscribers();
      hasSubscriber = true;
    } else {
      console.error('FirebaseSubscriber already started');
    }
  };

  const stopSubscribers = async () => {
    if (hasSubscriber && subscriber) {
      await subscriber.removeSubscribers();
      hasSubscriber = false;
      subscriber = null;
    }
  };

  return {
    startSubscribers,
    stopSubscribers,
  };
};

export const { startSubscribers, stopSubscribers } =
  FirebaseSubscriberInitiator();

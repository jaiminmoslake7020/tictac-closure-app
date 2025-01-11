import {
  getGameDocumentPath,
  InitializeContextsFunctionType,
  useContextGamePlayerType,
} from '@contexts/index';
import {
  GameActionCallbacksType,
  GameActions,
  GameActionsType,
} from '@components/game/GameActions';
import { AddErrorWithAction } from '@components/base/ux/notification/AddErrorWithAction';
import { updateLastActive } from '@firebase-dir/game';

export const UpdateLastActiveTimeSubscriber = (
  contextsData: InitializeContextsFunctionType,
  gameActionsCallback: GameActionCallbacksType,
) => {
  let errorAdded = false;

  const updateGameIsActive = async () => {
    // console.log('updateGameIsActive');
    const gamePath = getGameDocumentPath(contextsData);
    if (gamePath) {
      // console.log('Game path correct.', gamePath, 'correct path');
      const { getPlayerType } = useContextGamePlayerType(contextsData);
      await updateLastActive(gamePath, getPlayerType());
    } else {
      // console.log('Game path is incorrect.', gamePath);
      if (errorAdded) {
        const gA = GameActions(
          contextsData,
          gameActionsCallback,
        ) as GameActionsType;
        gA.exitRoom();
      } else {
        const gA = GameActions(
          contextsData,
          gameActionsCallback,
        ) as GameActionsType;
        AddErrorWithAction('Game path is incorrect.', gA.exitRoom);
        errorAdded = true;
      }
    }
  };

  const updateGameIsActiveSubscriber = async () => {
    // console.log('updateGameIsActiveSubscriber');
    await updateGameIsActive();
    const interval = setInterval(async () => {
      const gamePath = getGameDocumentPath(contextsData);
      if (gamePath) {
        await updateGameIsActive();
      } else {
        // console.log('closing interval updateGameIsActiveSubscriber');
        clearInterval(interval);
      }
    }, 3000);
  };

  return {
    updateGameIsActive,
    updateGameIsActiveSubscriber,
  };
};

import {getGameDocumentPath, InitializeContextsFunctionType, useContextGamePlayerType,} from '@contexts/index';
import {GameActionCallbacksType,} from '@components/game/GameActions';
import {updateLastActive} from '@firebase-dir/game';
import {ShowErrorMessageWrapper} from '@components/game/opponent-selection/remote-friend-player/ShowErrorMessageWrapper';

export const UpdateLastActiveTimeSubscriber = (
  contextsData: InitializeContextsFunctionType,
  gameActionsCallback: GameActionCallbacksType,
  subscriberFrom: string
) => {
  let interval: NodeJS.Timeout;

  const {
    showErrorMessage
  } = ShowErrorMessageWrapper(contextsData, gameActionsCallback);

  const updateGameIsActive = async (gamePath: string | undefined) => {
    // console.log('updateGameIsActive');
    if (gamePath) {
      // console.log('Game path correct.', gamePath, 'correct path');
      const { getPlayerType } = useContextGamePlayerType(contextsData);
      await updateLastActive(gamePath, getPlayerType());
    } else {
      showErrorMessage('Game path is incorrect. - 3');
    }
  };

  const updateGameIsActiveSubscriber = async () => {
    // console.log('updateGameIsActiveSubscriber');
    const gamePathFirst = getGameDocumentPath(contextsData);
    await updateGameIsActive( gamePathFirst );
    interval = setInterval(async () => {
      const gamePath = getGameDocumentPath(contextsData);
      if (gamePath) {
        // console.log('subscriberFrom', subscriberFrom);
        await updateGameIsActive( gamePath );
      } else {
        console.log('closing interval updateGameIsActiveSubscriber BY setInterval');
        clearInterval(interval);
      }
    }, 3000);
  };

  const removeUpdateGameIsActiveSubscriber = () => {
    // console.log('removeUpdateGameIsActiveSubscriber BY CALLER');
    clearInterval(interval);
  }

  return {
    updateGameIsActive,
    updateGameIsActiveSubscriber,
    removeUpdateGameIsActiveSubscriber
  };
};

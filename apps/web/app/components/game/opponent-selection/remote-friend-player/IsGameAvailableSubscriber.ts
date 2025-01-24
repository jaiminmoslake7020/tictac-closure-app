import {getGameDocumentPath, InitializeContextsFunctionType} from '@contexts/index';
import {GameActionCallbacksType,} from '@components/game/GameActions';
import {getGame} from '@firebase-dir/game';
import {getCurrentTime} from '@utils/index';
import {ShowErrorMessageWrapper} from '@components/game/opponent-selection/remote-friend-player/ShowErrorMessageWrapper';

export const IsGameAvailableSubscriber = (
  contextsData: InitializeContextsFunctionType,
  gameActionsCallback: GameActionCallbacksType,
  subscriberFrom: string
) => {
  let errorAdded = false;

  let interval : NodeJS.Timeout;

  const {
    showErrorMessage
  } = ShowErrorMessageWrapper(contextsData, gameActionsCallback);

  const isGameAvailable = async ( gamePath: string | undefined ): Promise<boolean> => {
    if (gamePath) {
      const gameData = await getGame(gamePath);
      if (gameData) {
        const { creator_last_active_time, joiner_last_active_time } = gameData;
        const isJoinerActive = getCurrentTime() - joiner_last_active_time > 5000;
        const isCreatorActive = getCurrentTime() - creator_last_active_time > 5000;
        // checking one of them has closed browser
        if (isJoinerActive || isCreatorActive) {
          // console.log('Game is expired.', getCurrentTime(), joiner_last_active_time, creator_last_active_time);
          showErrorMessage('Another player left game.');
          return false;
        }
        return true;
      } else {
        showErrorMessage('Game is not available at Firebase.');
        return false;
      }
    } else {
      showErrorMessage('Game path is incorrect. - 1');
    }
    return false;
  };

  const isGameAvailableSubscriber = async () => {
    // console.log('isGameAvailableSubscriber');
    const gamePathFirst = getGameDocumentPath(contextsData);
    await isGameAvailable( gamePathFirst );
    interval = setInterval(async () => {
      const gamePath = getGameDocumentPath(contextsData);
      if (gamePath) {
        // console.log('subscriberFrom', subscriberFrom);
        await isGameAvailable( gamePath );
      } else {
        console.log('closing interval isGameAvailableSubscriber BY setInterval');
        clearInterval(interval);
      }
    }, 5000);
  };

  const removeGameAvailableSubscriber = () => {
    // console.log('removeGameAvailableSubscriber BY CALLER');
    clearInterval(interval);
  }

  return {
    isGameAvailableSubscriber,
    isGameAvailable,
    removeGameAvailableSubscriber,
  };
};

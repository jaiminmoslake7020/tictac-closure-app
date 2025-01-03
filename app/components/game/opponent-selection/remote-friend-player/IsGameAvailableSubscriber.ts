import {
  getGameDocumentPath,
  InitializeContextsFunctionType
} from '@contexts/index';
import {GameActionCallbacksType, GameActions, GameActionsType} from '@components/game/GameActions';
import {getGame} from '@firebase-dir/game';
import {AddErrorWithAction} from '@components/base/ux/notification/AddErrorWithAction';
import {addToRoot, createEL, getCurrentTime} from '@utils/index';
import {Layout} from '@components/layouts/layout/Layout';

export const IsGameAvailableSubscriber = (contextsData:InitializeContextsFunctionType, gameActionsCallback:GameActionCallbacksType) => {

  let errorAdded = false;

  const showErrorMessage = (message: string) => {
    if (errorAdded) {
      const gA = GameActions(contextsData, gameActionsCallback) as GameActionsType;
      gA.exitRoom();
    } else {
      const gA = GameActions(contextsData, gameActionsCallback) as GameActionsType;
      addToRoot(Layout(createEL('div') as HTMLDivElement, gA));
      AddErrorWithAction(message, gA.exitRoom);
      errorAdded = true;
    }
  }

  const isGameAvailable = async () : Promise<boolean> => {
    // console.log('isGameAvailable');
    const gamePath = getGameDocumentPath(contextsData);
    if (gamePath) {
      const gameData = await getGame(gamePath);
      if (gameData) {
        const { creator_last_active_time, joiner_last_active_time } = gameData;
        const isJoinerActive = getCurrentTime() - joiner_last_active_time > 5000;
        const isCreatorActive = getCurrentTime() - creator_last_active_time > 5000;
        if (
          isJoinerActive && isCreatorActive
        ) {
          // console.log('Game is expired.', getCurrentTime(), joiner_last_active_time, creator_last_active_time);
          showErrorMessage('Game is expired.');
          return false;
        }
        return true;
      } else {
        showErrorMessage('Game is not available at Firebase.');
        return false;
      }
    } else {
      // console.log('Game path is incorrect.', gamePath);
      showErrorMessage('Game path is incorrect.');
    }
    return false;
  }

  const isGameAvailableSubscriber = async () => {
    // console.log('isGameAvailableSubscriber');
    await isGameAvailable();
    const interval = setInterval(async () => {
      const gamePath = getGameDocumentPath(contextsData);
      if (gamePath) {
        await isGameAvailable();
      } else {
        // console.log('closing interval isGameAvailableSubscriber');
        clearInterval(interval);
      }
    }, 5000);
  }

  return {
    isGameAvailableSubscriber,
    isGameAvailable
  }
}

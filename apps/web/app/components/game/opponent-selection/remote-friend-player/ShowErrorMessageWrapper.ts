import {GameActionCallbacksType, GameActions, GameActionsType} from '@components/game/GameActions';
import {addToRoot, createEL} from '@utils/index';
import {Layout} from '@components/layouts/layout/Layout';
import {AddErrorWithAction} from '@components/base/ux/notification/AddErrorWithAction';
import {InitializeContextsFunctionType} from '@contexts/index';

export type ShowErrorMessageWrapperType = {
  showErrorMessage: (message: string) => void;
  showJustErrorMessage: (message: string) => void;
}

export const ShowErrorMessageWrapper  = (
  contextsData : InitializeContextsFunctionType,
  gameActionsCallback : GameActionCallbacksType,
) : ShowErrorMessageWrapperType => {

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

  const showJustErrorMessage = (message: string) => {
    const gA = GameActions(contextsData, gameActionsCallback) as GameActionsType;
    addToRoot(Layout(createEL('div') as HTMLDivElement, gA));
    AddErrorWithAction(message, gA.exitRoom);
  }

  return {
    showErrorMessage,
    showJustErrorMessage
  }
}

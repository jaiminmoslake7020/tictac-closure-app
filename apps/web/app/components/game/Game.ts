import { addToRoot } from '@utils/index';
import { LoadTicTacApp, LoadTicTacAppType } from '@tic-tac/LoadTicTacApp';
import { InitializeContextsFunctionType } from '@contexts/index';
import { OpponentSelection } from './opponent-selection/OpponentSelection';
import { Layout } from '@components/layouts/layout/Layout';
import { GameActionCallbacksType, GameActions } from './GameActions';
import { useState } from '@components/base';

export const Game = (
  contextsData: InitializeContextsFunctionType,
  onLogout: () => void
) => {
  const { get, set } = useState() as {
    get: () => LoadTicTacAppType;
    set: (item: LoadTicTacAppType) => void;
    remove: () => void;
  };

  const getGameActionsObject = (): GameActionCallbacksType => {
    return {
      onExitRoom: init,
      onLogout,
      onGameTypeChanged: init,
      exitGame: undefined,
    };
  };

  const onLevelSelected = () => {
    const app = LoadTicTacApp(contextsData, getGameActionsObject());
    set(app);

    const gaObject = { ...getGameActionsObject(), exitGame: app.exitGame };
    const ga = GameActions(contextsData, gaObject);
    addToRoot(Layout(get().render(), ga));
  };

  const init = async () => {
    const gameActionsCallback = {
      onExitRoom: init,
      onLogout,
      onGameTypeChanged: init,
      exitGame: undefined,
    };
    const t = OpponentSelection(
      contextsData,
      onLevelSelected,
      gameActionsCallback
    );
    t.render();
  };

  return {
    init,
  };
};

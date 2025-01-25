import { OpponentType } from '@types-dir/index';
import { OpponentSelectionForm } from '@components/game/opponent-selection/OpponentSelectionForm';
import { AskForAppLevelType } from '@components/game/info-tab/AskForAppLevelType';
import { addToRoot } from '@utils/index';
import { Layout } from '@components/layouts/layout/Layout';
import { CheckRoomSelected } from '@components/game/opponent-selection/remote-friend-player/CheckRoomSelected';
import {
  InitializeContextsFunctionType,
  useContextGameId,
  useContextOpponentType,
  useContextRoomCodeId,
  useContextTurnStorage,
  UseOpponentTypeHookType,
} from '@contexts/index';
import { useState } from '@components/base';
import {
  GameActionCallbacksType,
  GameActions,
} from '@components/game/GameActions';
import { RemoteRandomWaitingRoom } from '@components/game/opponent-selection/remote-random-player/RemoteRandomWaitingRoom';
import {
  computerProgram,
  remoteFriendPlayer,
  remoteRandomPlayer,
  sameDevicePlay,
} from '@data/index';
import { RemoteRandomRestartDisplay } from '@components/game/opponent-selection/remote-random-player/RemoteRandomRestartDisplay';

export type OpponentSelectionType = {
  render: () => void | Promise<void>;
  remove: () => void;
};

export const OpponentSelection = (
  contextsData: InitializeContextsFunctionType,
  onLevelSelected: () => void,
  gameActions: GameActionCallbacksType
): OpponentSelectionType => {
  const { get: getVarOne, set: setVarOne } = useState();

  const { setOpponentType, hasOpponentType, getOpponentType } =
    useContextOpponentType(contextsData) as UseOpponentTypeHookType;
  const { removeGameId } = useContextGameId(contextsData);
  const { removeRoomCodeId } = useContextRoomCodeId(contextsData);

  const askAppLevelType = () => {
    const t = AskForAppLevelType(onLevelSelected, false, contextsData);
    const f = t.render();
    if (f) {
      const gA = GameActions(contextsData, gameActions);
      addToRoot(Layout(f, gA));
    }
  };

  const remoteFriendPlayerSelected = () => {
    // console.log('remoteFriendPlayerSelected');
    const { startCheckRoomSelected } = CheckRoomSelected(
      contextsData,
      onLevelSelected,
      gameActions
    );
    startCheckRoomSelected();
  };

  const remoteRandomPlayerSelected = () => {
    const { render } = RemoteRandomWaitingRoom(
      contextsData,
      () => {
        // remote random player or remote LLM becomes remote friend player once room and game is selected
        setOpponentType(remoteFriendPlayer);
        remoteFriendPlayerSelected();
      },
      gameActions
    );
    render();
  };

  const onPlayerSelected = async (value: OpponentType) => {
    const { resetTurnStorage } = useContextTurnStorage(contextsData);
    resetTurnStorage();

    setOpponentType(value);
    if (value === computerProgram) {
      askAppLevelType();
    } else if (value === sameDevicePlay) {
      askAppLevelType();
    } else if (value === remoteFriendPlayer) {
      remoteFriendPlayerSelected();
    } else if (value === remoteRandomPlayer) {
      remoteRandomPlayerSelected();
    }
  };

  const showForm = () => {
    removeGameId();
    removeRoomCodeId();
    setVarOne(OpponentSelectionForm(onPlayerSelected));
    const gA = GameActions(contextsData, gameActions);
    addToRoot(Layout(getVarOne().render(), gA));
  };

  const showRestartButton = () => {
    const gA = GameActions(contextsData, gameActions);
    const c = RemoteRandomRestartDisplay(
      async () => {
        c.remove();
        await onPlayerSelected(getOpponentType());
      },
      () => {
        c.remove();
        gA.changeGameType();
      }
    );
    addToRoot(Layout(c.render(), gA));
  };

  const render = async () => {
    if (hasOpponentType()) {
      // console.log('OpponentType Exists', getOpponentType());
      if (getOpponentType() === remoteRandomPlayer) {
        showRestartButton();
      } else {
        await onPlayerSelected(getOpponentType());
      }
    } else {
      showForm();
    }
  };

  const remove = () => {
    getVarOne().remove();
  };

  return {
    render,
    remove,
  };
};

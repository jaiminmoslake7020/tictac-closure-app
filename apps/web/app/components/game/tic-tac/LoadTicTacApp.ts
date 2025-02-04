import { TicTac, TicTacType } from './TicTac';
import {
  InitializeContextsFunctionType,
  isItRemoteGame,
} from '@contexts/index';
import { useDiv, useState } from '@components/base';
import { GameActionCallbacksType } from '@components/game/GameActions';
import { RoomActiveSubscriber } from '@components/game/opponent-selection/remote-friend-player/RoomActiveSubscriber';

export type LoadTicTacAppType = {
  render: () => HTMLDivElement;
  exitGame: () => void;
};

export const LoadTicTacApp = (
  contextsData: InitializeContextsFunctionType,
  gameActionsObject: GameActionCallbacksType
): LoadTicTacAppType => {
  const { getDiv, setDiv } = useDiv();
  const { getDiv: getDivOne, setDiv: setDivOne } = useDiv();

  const { get, set } = useState() as {
    get: () => TicTacType;
    set: (item: TicTacType) => void;
  };

  const addRoomActiveSubscriber = (ga: GameActionCallbacksType) => {
    const { checkRoomActiveSubscriber } = RoomActiveSubscriber(
      contextsData,
      ga
    );
    checkRoomActiveSubscriber();
  };

  const render = () => {
    set(TicTac(contextsData, gameActionsObject));

    setDiv('main');
    setDivOne('content-wrapper');
    getDivOne().append(get().render());

    getDiv().append(getDivOne());

    window.history.pushState(null, '', '#/app');

    if (isItRemoteGame(contextsData)) {
      addRoomActiveSubscriber({ ...gameActionsObject, exitGame: exitGame });
    }
    return getDiv();
  };

  const exitGame = () => {
    get().exitGame();
  };

  return {
    render,
    exitGame,
  };
};

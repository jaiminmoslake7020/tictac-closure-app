import { TicTac, TicTacType } from './TicTac';
import { InitializeContextsFunctionType } from '@contexts/index';
import { useDiv, useState } from '@components/base';
import { GameActionCallbacksType } from '@components/game/GameActions';

export type LoadTicTacAppType = {
  render: () => HTMLDivElement;
};

export const LoadTicTacApp = (
  contextsData: InitializeContextsFunctionType,
  gameActionsObject: GameActionCallbacksType,
): LoadTicTacAppType => {
  const { getDiv, setDiv } = useDiv();
  const { getDiv: getDivOne, setDiv: setDivOne } = useDiv();

  const { get, set } = useState() as {
    get: () => TicTacType;
    set: (item: TicTacType) => void;
  };

  const render = () => {
    set(TicTac(contextsData, gameActionsObject));

    setDiv('main');
    setDivOne('content-wrapper');
    getDivOne().append(get().render());

    getDiv().append(getDivOne());

    window.history.pushState(null, '', '#/app');
    return getDiv();
  };

  return {
    render,
  };
};

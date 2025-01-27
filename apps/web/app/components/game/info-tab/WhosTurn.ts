import { P } from '@components/base';
import {
  InitializeContextsFunctionType,
  isItRemoteGame,
  isItRemotePlayerTurn,
  useContextAnotherPlayer,
  useContextOpponentType,
  useContextTurnHookType,
} from '@contexts/index';
import {
  computerProgram,
  remoteFriendPlayer,
  sameDevicePlay,
} from '@data/index';

export type WhosTurnFunctionType = {
  render: () => HTMLParagraphElement;
  remove: () => void;
  updateTurn: () => void;
};

export const WhosTurn = (
  contextsData: InitializeContextsFunctionType
): WhosTurnFunctionType => {
  const { getOpponentType } = useContextOpponentType(contextsData);

  const { getAnotherPlayer } = useContextAnotherPlayer(contextsData);

  const { getTurn } = useContextTurnHookType(contextsData);

  let p: undefined | HTMLParagraphElement;
  const setP = (item: HTMLParagraphElement) => {
    p = item;
  };
  const getP = (): HTMLParagraphElement => {
    return p as HTMLParagraphElement;
  };

  const render = () => {
    setP(P('', 'info-p player-text'));
    return getP();
  };

  const updateClasses = () => {
    if (isItRemoteGame(contextsData)) {
      if (!isItRemotePlayerTurn(contextsData)) {
        getP().classList.remove('user-is-not-a-player');
        getP().classList.add('user-is-player');
      } else {
        getP().classList.add('user-is-not-a-player');
        getP().classList.remove('user-is-player');
      }
    }
  };

  const update = (text: string) => {
    getP().innerHTML = text;
    updateClasses();
  };

  const remove = () => {
    getP().remove();
  };

  const getPlayerName = (): string => {
    if (!isItRemotePlayerTurn(contextsData)) {
      return 'Your Turn';
    }
    return 'Current Turn: "' + getAnotherPlayer().username + '"';
  };

  const updateTurn = () => {
    if (
      getOpponentType() === computerProgram ||
      getOpponentType() === sameDevicePlay
    ) {
      const newTurn = getTurn();
      update('Current turn: ' + newTurn);
    } else if (getOpponentType() === remoteFriendPlayer) {
      update(getPlayerName());
    }
  };

  return {
    render,
    remove,
    updateTurn,
  };
};

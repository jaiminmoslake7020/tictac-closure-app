import {P} from '@components/base';
import {
  getUserId,
  InitializeContextsFunctionType,
  isItGameWithOpenAi,
  isItRemoteGame,
  isItRemotePlayerTurn,
  isItSameDeviceGame,
  useContextAnotherPlayer, useContextCurrentMove,
  useContextTurnHookType,
} from '@contexts/index';

export type WhosTurnFunctionType = {
  render: () => HTMLParagraphElement;
  remove: () => void;
  updateTurn: () => void;
};

export const WhosTurn = (
  contextsData: InitializeContextsFunctionType
): WhosTurnFunctionType => {

  const { getAnotherPlayer } = useContextAnotherPlayer(contextsData);

  const { getTurn } = useContextTurnHookType(contextsData);

  const { getCurrentMove } = useContextCurrentMove(contextsData);

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
      isItSameDeviceGame(contextsData)
    ) {
      const newTurn = getTurn();
      update('Current turn: ' + newTurn);
    } else if (isItRemoteGame(contextsData)) {
      update(getPlayerName());
    }  else if (isItGameWithOpenAi(contextsData)) {
      const currentMove = getCurrentMove();
      const userId = getUserId(contextsData);
      update( userId === currentMove ? 'Your Turn' : 'Current Turn: "' + getAnotherPlayer().username + '"' );
    }
  };

  return {
    render,
    remove,
    updateTurn,
  };
};

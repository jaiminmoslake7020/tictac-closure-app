import {
  getGameIdWithRoomCode,
  InitializeContextsFunctionType,
  useContextGamePlayerType,
  useContextOpponentType,
  useContextWinner,
} from '@contexts/index';
import { Winner, WinnerFunctionType } from './Winner';
import { WhosTurn, WhosTurnFunctionType } from './WhosTurn';
import {
  ChangeAppLevelInfoTabButton,
  ChangeAppLevelInfoTabButtonType,
} from './ChangeAppLevelInfoTabButton';
import { useDiv, useState } from '@components/base';
import { RestartGameButton, RestartGameButtonType } from './RestartGameButton';

export type InfoTabType = {
  render: () => HTMLDivElement;
  addTurn: () => void;
  updateInfo: (reload: () => void) => void;
  resetApp: () => void;
  updateRoomInfo: () => void;
};

export const InfoTab = (
  onLevelChange: () => void,
  contextsData: InitializeContextsFunctionType,
): InfoTabType => {
  const DEBUG_ROOM_INFO = false;

  const { getOpponentType } = useContextOpponentType(contextsData);
  const { getPlayerType } = useContextGamePlayerType(contextsData);

  const { getDiv, setDiv } = useDiv();

  const { getDiv: getDivOne, setDiv: setDivOne } = useDiv();

  const {
    get: getWhosTurn,
    set: setWhosTurn,
    remove: removeWhosTurn,
  } = useState() as {
    get: () => WhosTurnFunctionType;
    set: (item: WhosTurnFunctionType) => void;
    remove: () => void;
  };

  const {
    get: getWinner,
    set: setWinner,
    remove: removeWinnerFn,
  } = useState() as {
    get: () => WinnerFunctionType;
    set: (item: WinnerFunctionType) => void;
    remove: () => void;
  };

  let restartGameButton: undefined | RestartGameButtonType;
  const setRestartGameButton = (item: RestartGameButtonType | undefined) => {
    restartGameButton = item;
  };
  const getRestartGameButton = (): RestartGameButtonType | undefined => {
    return restartGameButton as RestartGameButtonType;
  };

  let changeLevelBtn: undefined | ChangeAppLevelInfoTabButtonType;
  const setChangeLevelBtn = (item: ChangeAppLevelInfoTabButtonType) => {
    changeLevelBtn = item;
  };
  const getChangeLevelBtn = () => {
    return changeLevelBtn as ChangeAppLevelInfoTabButtonType;
  };

  const reset = () => {
    removeTurn();
    removeWinner();
    removeRestartButton();
  };

  const addChangeLevelBtn = () => {
    setChangeLevelBtn(
      ChangeAppLevelInfoTabButton(contextsData, () => {
        reset();
        onLevelChange();
      }),
    );
    getDiv().append(getChangeLevelBtn().render());
  };

  const render = () => {
    setDiv('info-tab');
    if (getOpponentType() === 'computer-program') {
      addChangeLevelBtn();
    }
    setDivOne('room-info');
    if (DEBUG_ROOM_INFO) {
      getDiv().append(getDivOne());
    }
    updateRoomInfo();
    return getDiv();
  };

  const addTurn = () => {
    setWhosTurn(WhosTurn(contextsData));
    getDiv().prepend((getWhosTurn() as WhosTurnFunctionType).render());
    (getWhosTurn() as WhosTurnFunctionType).updateTurn();
  };

  const removeTurn = () => {
    const w = getWhosTurn();
    if (w) {
      (w as WhosTurnFunctionType).remove();
      removeWhosTurn();
    }
  };

  const addWinner = () => {
    removeTurn();
    setWinner(Winner(contextsData));
    getDiv().prepend(getWinner().render());
    getWinner().update();
  };

  const removeWinner = () => {
    const w = getWinner();
    if (w) {
      (w as WinnerFunctionType).remove();
      removeWinnerFn();
    }
  };

  const removeRestartButton = () => {
    const w = getRestartGameButton();
    if (w) {
      (w as RestartGameButtonType).setButtonEnabled(false);
      (w as RestartGameButtonType).remove();
      setRestartGameButton(undefined);
    }
  };

  const onGameRestart = (reload: Function) => {
    removeTurn();
    removeWinner();
    updateRoomInfo();
    const w = getRestartGameButton();
    if (w) {
      (w as RestartGameButtonType).remove();
      setRestartGameButton(undefined);
    }
    reload();
  };

  const addRestartGameButton = (reload: Function) => {
    setRestartGameButton(
      RestartGameButton(onGameRestart.bind(null, reload), getPlayerType()),
    );
    getDiv().append((getRestartGameButton() as RestartGameButtonType).render());
  };

  const updateRoomInfo = () => {
    if (DEBUG_ROOM_INFO) {
      const { getWinner } = useContextWinner(contextsData);
      if (getWinner() === null) {
        const result = getGameIdWithRoomCode(contextsData);
        if (result && result.roomCodeId && result.gameId) {
          // getDivOne().innerHTML = `Room Code: ${result.roomCodeId} Game Id: ${result.gameId}`;
        } else {
          getDivOne().innerHTML = '';
        }
      } else {
        getDivOne().innerHTML = '';
      }
    }
  };

  const updateInfo = (reload: () => void) => {
    const { getWinner } = useContextWinner(contextsData);
    updateRoomInfo();
    if (getWinner() !== null) {
      addWinner();
      addRestartGameButton(reload);
    } else {
      (getWhosTurn() as WhosTurnFunctionType).updateTurn();
    }
  };

  const resetApp = () => {
    updateRoomInfo();
    removeWinner();
    removeRestartButton();
  };

  return {
    render,
    addTurn,
    updateInfo,
    resetApp,
    updateRoomInfo,
  };
};

// let whosTurn : undefined | WhosTurnFunctionType ;
// const setWhosTurn = (item: WhosTurnFunctionType | undefined) => {
//   whosTurn = item;
// }
// const getWhosTurn = () : WhosTurnFunctionType | undefined  => {
//   return whosTurn as WhosTurnFunctionType;
// }

// let winner : undefined | WinnerFunctionType ;
// const setWinner = (item: WinnerFunctionType | undefined) => {
//   winner = item;
// }
// const getWinner = () => {
//   return winner as WinnerFunctionType;
// }

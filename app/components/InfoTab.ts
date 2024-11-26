import { TurnType, WinnerType} from '../types';
import {InitializeContextsFunctionType} from '../contexts';
import {Winner, WinnerFunctionType} from './Winner';
import {WhosTurn, WhosTurnFunctionType} from './WhosTurn';
import {ChangeAppLevelInfoTabButton, ChangeAppLevelInfoTabButtonType} from './ChangeAppLevelInfoTabButton';
import {useDiv} from './base/Div';
import {RestartGameButton, RestartGameButtonType} from './RestartGameButton';

export type InfoTabType = {
  render : () => HTMLDivElement,
  addTurn:  (newTurn: TurnType) => void,
  updateTurn:  (newTurn: TurnType) => void,
  removeTurn: () => void,
  addWinner: (winnerValue: WinnerType) => void,
  addRestartGameButton: (reload: Function) => void,
  getInfoDiv: () => HTMLDivElement,
  setInfoDiv: (classList?: string) => void
};

export const InfoTab = (turn: TurnType, onLevelChange: () => void, contextsData: InitializeContextsFunctionType) :InfoTabType => {

  const {
    getDiv,
    setDiv
  } = useDiv();

  let whosTurn : undefined | WhosTurnFunctionType ;
  const setWhosTurn = (item: WhosTurnFunctionType | undefined) => {
    whosTurn = item;
  }
  const getWhosTurn = () : WhosTurnFunctionType | undefined  => {
    return whosTurn as WhosTurnFunctionType;
  }

  let winner : undefined | WinnerFunctionType ;
  const setWinner = (item: WinnerFunctionType | undefined) => {
    winner = item;
  }
  const getWinner = () => {
    return winner as WinnerFunctionType;
  }

  let restartGameButton : undefined | RestartGameButtonType ;
  const setRestartGameButton = (item : RestartGameButtonType | undefined ) => {
    restartGameButton = item;
  }
  const getRestartGameButton = () : RestartGameButtonType | undefined => {
    return restartGameButton as RestartGameButtonType;
  }

  let changeLevelBtn : undefined | ChangeAppLevelInfoTabButtonType ;
  const setChangeLevelBtn = (item:ChangeAppLevelInfoTabButtonType) => {
    changeLevelBtn = item;
  }
  const getChangeLevelBtn = () => {
    return changeLevelBtn as ChangeAppLevelInfoTabButtonType;
  }

  const reset = () => {
    removeTurn();
    removeWinner();
    removeRestartButton();
  }

  const render = () => {
    setDiv('info-tab');
    setChangeLevelBtn(
      ChangeAppLevelInfoTabButton(contextsData, () => {
        reset();
        onLevelChange();
      })
    );
    getDiv().append(getChangeLevelBtn().render());
    return getDiv();
  }

  const addTurn = (newTurn: TurnType) => {
    setWhosTurn( WhosTurn() );
    const w = (getWhosTurn() as WhosTurnFunctionType);
    getDiv().prepend( w.render() );
    w.update( newTurn );
  }

  const updateTurn = (newTurn: TurnType) => {
    const w = (getWhosTurn() as WhosTurnFunctionType);
    w.update( newTurn );
  }

  const removeTurn = () => {
    const w = getWhosTurn();
    if (w) {
      (w as WhosTurnFunctionType).remove();
      setWhosTurn(undefined);
    }
  }

  const addWinner = (winnerValue: WinnerType) => {
    removeTurn();
    setWinner( Winner() );
    getDiv().prepend( getWinner().render() );
    getWinner().update( winnerValue );
  }

  const removeWinner = () => {
    const w = getWinner();
    if (w) {
      (w as WhosTurnFunctionType).remove();
      setWinner(undefined);
    }
  }

  const removeRestartButton = () => {
    const w = getRestartGameButton();
    if (w) {
      (w as RestartGameButtonType).setButtonEnabled(false);
      (w as RestartGameButtonType).remove();
      setRestartGameButton(undefined);
    }
  }

  const addRestartGameButton = (reload: Function) => {
    setRestartGameButton(RestartGameButton( () => {
      removeTurn();
      removeWinner();
      const w = getRestartGameButton();
      if (w) {
        (w as RestartGameButtonType).remove();
        setRestartGameButton(undefined);
      }
      reload();
    } ));
    getDiv().append((getRestartGameButton() as RestartGameButtonType).render());
  }

  return {
    render,
    updateTurn,
    addWinner,
    addRestartGameButton,
    addTurn,
    removeTurn,
    setInfoDiv: setDiv,
    getInfoDiv: getDiv,
  }
}

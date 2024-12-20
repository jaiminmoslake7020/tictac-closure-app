import {
  InitializeContextsFunctionType,
  useContextGameType,
  useContextWinner
} from '../../../contexts';
import {Winner} from './Winner';
import {WhosTurn, WhosTurnFunctionType} from './WhosTurn';
import {ChangeAppLevelInfoTabButton, ChangeAppLevelInfoTabButtonType} from './ChangeAppLevelInfoTabButton';
import {useDiv, useState} from '../../base';
import {RestartGameButton, RestartGameButtonType} from './RestartGameButton';

export type InfoTabType = {
  render : () => HTMLDivElement,
  addTurn:  () => void,
  updateInfo: (reload: () => void) => void,
};

export const InfoTab = (onLevelChange: () => void, contextsData: InitializeContextsFunctionType) :InfoTabType => {

  const {
    getGameType
  } = useContextGameType( contextsData );

  const {
    getDiv,
    setDiv
  } = useDiv();

  const {
    get : getWhosTurn,
    set : setWhosTurn
  } = useState();

  const {
    get : getWinner,
    set : setWinner
  } = useState();


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

  const addChangeLevelBtn = () => {
    setChangeLevelBtn(
      ChangeAppLevelInfoTabButton(contextsData, () => {
        reset();
        onLevelChange();
      })
    );
    getDiv().append(getChangeLevelBtn().render());
  }

  const render = () => {
    setDiv('info-tab');
    if ( getGameType() === 'computer-program' ) {
      addChangeLevelBtn();
    }
    return getDiv();
  }

  const addTurn = () => {
    setWhosTurn( WhosTurn( contextsData ) );
    getDiv().prepend( (getWhosTurn() as WhosTurnFunctionType).render() );
    (getWhosTurn() as WhosTurnFunctionType).updateTurn();
  }

  const removeTurn = () => {
    const w = getWhosTurn();
    if (w) {
      (w as WhosTurnFunctionType).remove();
      setWhosTurn(undefined);
    }
  }

  const addWinner = () => {
    removeTurn();
    setWinner( Winner( contextsData ) );
    getDiv().prepend( getWinner().render() );
    getWinner().update();
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

  const updateInfo = (reload: () => void) => {
    const { getWinner } = useContextWinner(contextsData);
    if ( getWinner() !== null) {
      addWinner();
      addRestartGameButton(reload);
    } else {
      (getWhosTurn() as WhosTurnFunctionType).updateTurn();
    }
  }

  return {
    render,
    addTurn,
    updateInfo
  }
}



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

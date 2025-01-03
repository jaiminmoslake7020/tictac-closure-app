import {addToRoot} from '@utils/index'
import {LoadTicTacApp} from '@tic-tac/LoadTicTacApp';
import {InitializeContextsFunctionType,} from '@contexts/index';
import {OpponentSelection} from './opponent-selection/OpponentSelection';
import {Layout} from '@components/layouts/layout/Layout';
import {GameActionCallbacksType, GameActions, GameActionsType} from './GameActions';


export const Game = ( contextsData: InitializeContextsFunctionType , onLogout : () => void) => {

  const getGameActionsObject = () : GameActionCallbacksType => {
    return  {
      onExitRoom: init,
      onLogout
    };
  }

  const getGameActions = () : GameActionsType => {
    return GameActions(contextsData, getGameActionsObject());
  }

  const onLevelSelected = () => {
    addToRoot( Layout( LoadTicTacApp( contextsData , getGameActionsObject() ).render() , getGameActions()) );
  }

  const init = async () => {
    const gameActionsCallback = {
      onExitRoom: init,
      onLogout
    };
    const t = OpponentSelection(contextsData, onLevelSelected, gameActionsCallback);
    t.render()
  }

  return {
    init
  }
}

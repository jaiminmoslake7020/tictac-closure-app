import {addToRoot} from '@utils/index'
import {LoadTicTacApp} from '@tic-tac/LoadTicTacApp';
import {
 InitializeContextsFunctionType,
} from '@contexts/index';
import {OpponentSelection} from './opponent-selection/OpponentSelection';
import {useState} from '@components/base';
import {Layout} from '@components/layouts/layout/Layout';
import {GameActions, GameActionsType} from './GameActions';


export const Game = ( contextsData: InitializeContextsFunctionType , onLogout : () => void) => {

  const {
    get: getGameActions, set: setGameActions
  } = useState() as {
    get: () => GameActionsType,
    set: (item:GameActionsType) => void
  };

  const onLevelSelected = () => {
    addToRoot( Layout( LoadTicTacApp( contextsData ).render() , getGameActions()) );
  }

  const init = async () => {
    const gameActionsCallback = {
      onExitRoom: init,
      onLogout
    };
    const gameActions = GameActions(contextsData, gameActionsCallback);
    setGameActions(gameActions);
    const t = OpponentSelection(contextsData, onLevelSelected, gameActionsCallback);
    const f = await t.render();
    if ( f ) {
      addToRoot(Layout(f, gameActions));
    }
  }

  return {
    init
  }
}

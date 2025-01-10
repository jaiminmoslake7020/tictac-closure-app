import {InitializeContextsFunctionType} from '@contexts/index';
import {GameActionsType} from '@components/game/GameActions';

export const JoinGame = (contextsData: InitializeContextsFunctionType, onLevelSelected: () => void, gameActionsCallback: GameActionsType) => {

  const checkGameIsAvailable = async () => {

  }


  return {
    checkGameIsAvailable
  }
}

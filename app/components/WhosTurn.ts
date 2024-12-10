import {P} from './base/Text';
import {TurnType} from '../types';
import {
  InitializeContextsFunctionType, isItRemotePlayerTurn,
  useContextAnotherPlayer,
  useContextGameType,
  useContextTurnHookType,
  useContextUserSession
} from '../contexts';

export type WhosTurnFunctionType = {
  render: () => HTMLParagraphElement,
  remove: () => void,
  updateTurn: () => void
};

export const WhosTurn = (contextsData: InitializeContextsFunctionType) : WhosTurnFunctionType => {

  const {
    getGameType
  } = useContextGameType( contextsData );

  const {
    getAnotherPlayer
  } = useContextAnotherPlayer( contextsData );

  const {
    getUser
  } = useContextUserSession( contextsData );

  const {
    getTurn
  } = useContextTurnHookType( contextsData );

  let p : undefined | HTMLParagraphElement;
  const setP = (item: HTMLParagraphElement) =>{
    p = item;
  }
  const getP = () : HTMLParagraphElement => {
    return p as HTMLParagraphElement;
  }

  const render = () => {
    setP( P('', 'info-p') );
    return getP();
  }

  const update = (newV: TurnType | string ) => {
    getP().innerHTML = 'Current Turn: "'+newV+'"';
  }

  const remove = () => {
    getP().remove();
  }

  const getPlayerName = () : string => {
    if ( !isItRemotePlayerTurn(contextsData) ) {
      const user = getUser();
      return user.username;
    }
    return getAnotherPlayer().username;
  }

  const updateTurn = () => {
    if ( getGameType() === 'computer-program' ) {
      const newTurn = getTurn();
      update( newTurn );
    } else if (getGameType() === 'remote-friend-player') {
      update( getPlayerName() );
    }
  }

  return {
    render,
    remove,
    updateTurn
  }
}

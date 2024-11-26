import {InfoTab, InfoTabType} from './InfoTab';
import { TurnHandler } from './TurnHandler'
import {
  TicTacTableType,
  TurnHandlerType,
} from '../types';
import {TicTacTable} from './TicTacTable';
import {
  InitializeContextsFunctionType,
  AppLevelHookType,
  useContextAppLevelType
} from '../contexts';
import {useDiv} from './base/Div';

export const TicTac = ( contextsData: InitializeContextsFunctionType ) => {
  let infoTabDiv: InfoTabType | undefined;
  let turnHandler: TurnHandlerType | undefined;
  let ticTacTableType: TicTacTableType | undefined;

  const { getAppLevelType  } = useContextAppLevelType( contextsData ) as AppLevelHookType;
  const {
    getDiv: getWrapperDiv,
    setDiv: setWrapperDiv
  } = useDiv();

  const setInfoTabDiv = (item: InfoTabType) => {
    infoTabDiv = item;
  }

  const setTurnHandlerType = (item: TurnHandlerType) => {
    turnHandler = item;
  }

  const getTurnHandlerType = () : TurnHandlerType => {
     return turnHandler as TurnHandlerType;
  }

  const setTicTacTable = (item: TicTacTableType) => {
    ticTacTableType = item;
  }

  const getTicTacTable = () : TicTacTableType => {
    return ticTacTableType as TicTacTableType;
  }

  const reload = () => {
    setTurnHandlerType( TurnHandler( getAppLevelType() ) );
    const t = getTurnHandlerType();
    const table = getTicTacTable();
    table.reset();
    getInfoTabDiv().addTurn( t.getTurn() );
  }

  const getInfoTabDiv = () : InfoTabType => {
    if ( !infoTabDiv ) {
      const t = getTurnHandlerType();
      setInfoTabDiv( InfoTab( t.getTurn(), reload, contextsData ) );
    }
    return infoTabDiv as InfoTabType;
  }

  const updateInfo = () => {
    const {
      getTurn, getWinner
    } = getTurnHandlerType();
    if (getWinner() !== null) {
      getInfoTabDiv().addWinner( getWinner() );
      getInfoTabDiv().addRestartGameButton(reload);
    } else {
      getInfoTabDiv().updateTurn( getTurn() );
    }
  }

  const render = () => {
    setTurnHandlerType( TurnHandler( getAppLevelType() ) );
    const t = getTurnHandlerType();
    setInfoTabDiv( InfoTab( t.getTurn() , reload, contextsData ) );
    setWrapperDiv( 'wrapper-div' );
    getWrapperDiv().append( getInfoTabDiv().render() );
    getInfoTabDiv().addTurn( t.getTurn() );
    const table = TicTacTable( getTurnHandlerType , updateInfo );
    setTicTacTable(table);
    getWrapperDiv().append(table.render());
    return getWrapperDiv();
  }

  return {
    render
  };
}

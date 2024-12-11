import {InfoTab, InfoTabType} from './InfoTab';
import { TurnHandler } from '../business-logic/TurnHandler'
import {
  MovePositionType,
  TicTacTableType,
  TurnHandlerType,
} from '../types';
import {TicTacTable} from './TicTacTable';
import {
  InitializeContextsFunctionType
} from '../contexts';
import {useDiv} from './base/Div';

export const TicTac = ( contextsData: InitializeContextsFunctionType ) => {
  let infoTabDiv: InfoTabType | undefined;
  let turnHandler: TurnHandlerType | undefined;
  let ticTacTableType: TicTacTableType | undefined;

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

  const anotherPersonMadeMove = async ( v: MovePositionType ) => {
    updateInfo();
    await getTicTacTable().updateOtherPersonMove( v );
  }

  const reload = () => {
    setTurnHandlerType( TurnHandler( contextsData , anotherPersonMadeMove ) );
    const t = getTurnHandlerType();
    const table = getTicTacTable();
    table.reset();
    getInfoTabDiv().addTurn();
  }

  const getInfoTabDiv = () : InfoTabType => {
    if ( !infoTabDiv ) {
      const t = getTurnHandlerType();
      setInfoTabDiv( InfoTab( reload, contextsData ) );
    }
    return infoTabDiv as InfoTabType;
  }

  const updateInfo = () => {
    getInfoTabDiv().updateInfo(reload);
  }

  const render = () => {
    setTurnHandlerType( TurnHandler( contextsData , anotherPersonMadeMove ) );
    const t = getTurnHandlerType();
    setInfoTabDiv( InfoTab( reload, contextsData ) );
    setWrapperDiv( 'wrapper-div' );
    getWrapperDiv().append( getInfoTabDiv().render() );
    getInfoTabDiv().addTurn();
    const table = TicTacTable( getTurnHandlerType , updateInfo , contextsData );
    setTicTacTable(table);
    getWrapperDiv().append(table.render());
    return getWrapperDiv();
  }

  return {
    render
  };
}

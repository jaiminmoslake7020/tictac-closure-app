import {createEL} from '../utils/index.js'
import { TurnInfo } from './TurnInfo.js'
import { TurnHandler } from './TurnHandler.js'
import {
  TicTacTableType,
  TurnHandlerType,
  TurnInfoType,
} from '../types/index.js';
import {TicTacTable} from './TicTacTable.js';

export const TicTac = () => {
  let wrapperDiv :undefined | HTMLDivElement;
  let turnInfoP: TurnInfoType | undefined;
  let turnHandler: TurnHandlerType | undefined;
  let ticTacTableType: TicTacTableType | undefined;

  const getWrapperDiv = () : HTMLDivElement => {
    return wrapperDiv as HTMLDivElement;
  }

  const setWrapperDiv = (item: HTMLDivElement) => {
    wrapperDiv = item;
  }

  const setTurnInfoP = (item: TurnInfoType) => {
    turnInfoP = item;
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

  const getTurnInfoP = () : TurnInfoType => {
    if ( !turnInfoP ) {
      const t = getTurnHandlerType();
      setTurnInfoP( TurnInfo( t.getTurn() ) );
    }
    return turnInfoP as TurnInfoType;
  }

  const reload = () => {
    setTurnHandlerType( TurnHandler() );
    const t = getTurnHandlerType();
    const table = getTicTacTable();
    table.reset();
    getTurnInfoP().reset( t.getTurn() );
  }

  const updateInfo = () => {
    const {
      getTurn, getWinner
    } = getTurnHandlerType();
    getTurnInfoP().update( getTurn() , getWinner() , reload);
  }

  const render = () => {
    setTurnHandlerType( TurnHandler() );
    const t = getTurnHandlerType();
    setTurnInfoP( TurnInfo( t.getTurn() ) );
    setWrapperDiv( createEL('div') as HTMLDivElement );
    getWrapperDiv().append( getTurnInfoP().render() );
    const table = TicTacTable( getTurnHandlerType , updateInfo );
    setTicTacTable(table);
    getWrapperDiv().append(table.render());
    getWrapperDiv().classList.add('wrapper-div')
    return getWrapperDiv();
  }

  return {
    render
  };
}

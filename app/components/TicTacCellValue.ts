import { createEL } from '../utils';
import {TurnType} from '../types';

export const TicTacCellValue = (v: TurnType) => {
  let div : undefined | HTMLDivElement;

  const getDiv = () : HTMLDivElement => {
    return div as HTMLDivElement;
  }

  const setDiv = (item: HTMLDivElement) => {
    div = item;
  }

  const render = () => {
    setDiv( createEL('div') as HTMLDivElement );
    getDiv().classList.add('tic-tac-cell-value');
    getDiv().innerHTML = v;
    return getDiv();
  }

  return {
    render
  }
}

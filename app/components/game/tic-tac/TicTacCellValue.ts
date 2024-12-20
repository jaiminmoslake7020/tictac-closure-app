import { createEL } from '../../../utils';
import {TurnType} from '../../../types';

export const TicTacCellValue = () => {
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
    return getDiv();
  }

  const addText = (v: TurnType) => {
    getDiv().innerHTML = v;
  }

  const removeText = (v: TurnType) => {
    getDiv().innerHTML = '';
  }

  return {
    render,
    addText,
    removeText
  }
}

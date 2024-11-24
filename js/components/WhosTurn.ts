import {P} from './base/Text.js';
import {TurnType} from '../types/index.js';

export type WhosTurnFunctionType = {
  render: () => HTMLParagraphElement,
  update: (newV: TurnType) => void,
  remove: () => void,
  removeText:() => void,
  setP: (v:HTMLParagraphElement) => void,
  getP: () => HTMLParagraphElement,
};

export const WhosTurn = () : WhosTurnFunctionType => {
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

  const update = (newV: TurnType) => {
    getP().innerHTML = 'Current Turn: "'+newV+'"';
  }

  const removeText = () => {
    getP().innerHTML = '';
  }

  const remove = () => {
    getP().remove();
  }

  return {
    render,
    update,
    remove,
    removeText,
    setP,
    getP
  }
}

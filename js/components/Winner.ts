import {P} from './base/Text.js';
import {WinnerType} from '../types/index.js';

export type WinnerFunctionType = {
  render: () => HTMLParagraphElement,
  remove: () => void,
  resetClasses: () => void,
  removeText: () => void,
  setP: (v:HTMLParagraphElement) => void,
  getP: () => HTMLParagraphElement,
  update: (v: WinnerType) => void
};

export const Winner = () : WinnerFunctionType => {
  let p : undefined | HTMLParagraphElement;

  const setP = (item: HTMLParagraphElement) =>{
    p = item;
  }
  const getP = () : HTMLParagraphElement => {
    return p as HTMLParagraphElement;
  }

  const render = () => {
    setP( P('', 'winner-found') )
    return getP();
  }

  const update = (v:WinnerType) => {
    if (v === "NONE") {
      getP().innerHTML = 'You both loose.';
    } else if (v === "X") {
      getP().classList.add('you-lost');
      getP().innerHTML = 'Found Winner: "X"';
    } else {
      getP().classList.add('you-win');
      getP().innerHTML = 'Found Winner: "O"';
    }
  }

  const remove = () => {
    getP().remove();
  }

  const removeText = () => {
    getP().innerHTML = '';
  }

  const resetClasses = () => {
    const classList = ['winner-found', 'you-lost', 'you-win'];
    classList.map((classitem: string) => {
      if ( getP().classList.contains(classitem) ) {
        getP().classList.remove(classitem);
      }
    });
  }

  return {
    setP,
    getP,
    render,
    remove,
    resetClasses,
    removeText,
    update
  }
}

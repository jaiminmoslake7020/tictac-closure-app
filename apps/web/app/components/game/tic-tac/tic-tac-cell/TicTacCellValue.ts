import { createEL } from '@utils/index';
import { TurnType } from '@types-dir/index';

export type TicTacCellValueType = {
  render: () => HTMLDivElement;
  addText: (v: TurnType) => void;
  removeText: () => void;
  remove: () => void;
};

export const TicTacCellValue = (): TicTacCellValueType => {
  let div: undefined | HTMLDivElement;

  const getDiv = (): HTMLDivElement => {
    return div as HTMLDivElement;
  };

  const setDiv = (item: HTMLDivElement) => {
    div = item;
  };

  const render = () => {
    setDiv(createEL('div') as HTMLDivElement);
    getDiv().classList.add('tic-tac-cell-value');
    return getDiv();
  };

  const addText = (v: TurnType) => {
    getDiv().innerHTML = v;
  };

  const removeText = () => {
    getDiv().innerHTML = '';
  };

  const remove = () => {
    getDiv().remove();
  };

  return {
    render,
    addText,
    removeText,
    remove,
  };
};

import {
  MovePositionType,
  TicTacCellRowFunctionType,
  TicTacTableType,
  TurnHandlerType,
} from '@types-dir/index';
import { createEL } from '@utils/index';
import { TicTacCellRow } from './TicTacCellRow';
import { InitializeContextsFunctionType } from '@contexts/index';

export const TicTacTable = (
  getTurnHandlerType: () => TurnHandlerType,
  updateInfo: () => void,
  contextData: InitializeContextsFunctionType,
): TicTacTableType => {
  let ticTacTable: undefined | HTMLDivElement;
  let ticTacTableBody: undefined | HTMLDivElement;

  const getTicTacTable = (): HTMLDivElement => {
    if (!ticTacTable) {
      setTicTacTable(createEL('div') as HTMLDivElement);
    }
    return ticTacTable as HTMLDivElement;
  };

  const setTicTacTable = (item: HTMLDivElement) => {
    ticTacTable = item;
  };

  const getTicTacTableBody = (): HTMLDivElement => {
    if (!ticTacTableBody) {
      setTicTacTableBody(createEL('div') as HTMLDivElement);
    }
    return ticTacTableBody as HTMLDivElement;
  };

  const setTicTacTableBody = (item: HTMLDivElement) => {
    ticTacTableBody = item;
  };

  const trArray = [] as TicTacCellRowFunctionType[];

  const handleChangeTurn = async (v: MovePositionType) => {
    const { changeTurn } = getTurnHandlerType();
    await changeTurn(v);
    for (let i = 0; i < 3; i++) {
      trArray[i].update(handleChangeTurn);
    }
    // console.log('handleChangeTurn updateInfo');
    updateInfo();
  };

  const render = () => {
    setTicTacTable(createEL('div') as HTMLDivElement);
    setTicTacTableBody(createEL('div') as HTMLDivElement);
    for (let i = 0; i < 3; i++) {
      const tr = TicTacCellRow(i + 1, handleChangeTurn, contextData);
      getTicTacTable().append(tr.render());
      trArray.push(tr);
    }
    getTicTacTable().classList.add('tic-tac-table');
    getTicTacTable().addEventListener('click', (e) => {
      // console.log('e', e);
    });
    return getTicTacTable();
  };

  const reset = () => {
    for (let i = 0; i < 3; i++) {
      trArray[i].reset(handleChangeTurn);
    }
  };

  const updateOtherPersonMove = async () => {
    for (let i = 0; i < 3; i++) {
      trArray[i].update(handleChangeTurn);
    }
    updateInfo();
  };

  return {
    render,
    reset,
    updateOtherPersonMove,
  };
};

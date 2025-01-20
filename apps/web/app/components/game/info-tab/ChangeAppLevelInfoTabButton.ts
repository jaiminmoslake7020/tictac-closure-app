import { AppLevelTypeDropdown } from './AppLevelTypeDropdown';
import { InitializeContextsFunctionType } from '@contexts/index';

export type ChangeAppLevelInfoTabButtonType = {
  setDiv: (v: HTMLDivElement) => void;
  getDiv: () => HTMLDivElement;
  render: () => HTMLDivElement;
  remove: () => void;
};

export const ChangeAppLevelInfoTabButton = (
  contextsData: InitializeContextsFunctionType,
  onLevelChange: () => void,
): ChangeAppLevelInfoTabButtonType => {
  let div: undefined | HTMLDivElement;

  const setDiv = (item: HTMLDivElement) => {
    div = item;
  };
  const getDiv = (): HTMLDivElement => {
    return div as HTMLDivElement;
  };

  const render = () => {
    setDiv(AppLevelTypeDropdown(contextsData, onLevelChange).render());
    return getDiv();
  };

  const remove = () => {
    getDiv().remove();
  };

  return {
    setDiv,
    getDiv,
    render,
    remove,
  };
};

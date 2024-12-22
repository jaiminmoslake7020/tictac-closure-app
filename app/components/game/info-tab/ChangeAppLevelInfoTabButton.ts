import {WinnerType} from '@types-dir/index';
import {AppLevelTypeDropdown} from './AppLevelTypeDropdown';
import {InitializeContextsFunctionType} from '@contexts/index';

export type ChangeAppLevelInfoTabButtonType = {
  setDiv: (v:HTMLDivElement) => void,
  getDiv: () => HTMLDivElement,
  update: (v: WinnerType) => void,
  render: () => HTMLDivElement,
  remove: () => void,
};

export const ChangeAppLevelInfoTabButton = (contextsData: InitializeContextsFunctionType, onLevelChange: () => void) : ChangeAppLevelInfoTabButtonType => {
  let div : undefined | HTMLDivElement;

  const setDiv = (item: HTMLDivElement) =>{
    div = item;
  }
  const getDiv = () : HTMLDivElement => {
    return div as HTMLDivElement;
  }

  const render = () => {
    setDiv(
      AppLevelTypeDropdown( contextsData , onLevelChange ).render()
    )
    return getDiv();
  }

  const update = (v:WinnerType) => {

  }

  const remove = () => {
    getDiv().remove();
  }

  return {
    setDiv,
    getDiv,
    render,
    remove,
    update
  }
}

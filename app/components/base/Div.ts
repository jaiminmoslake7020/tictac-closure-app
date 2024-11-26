import {applyClassList, createEL} from '../../utils';

export const Div = (classList?: string) => {
  let div = createEL('div');
  if (classList) {
    div = applyClassList(div, classList);
  }
  return div as HTMLDivElement;
}

export const Dropdown = (classList: string) => {
  let dropdown = Div('dropdown');
  if (classList) {
    dropdown = applyClassList(dropdown, classList);
  }
  return dropdown;
}

export const DropdownContainer = (classList: string) => {
  let dropdownCotainer = Div('dropdown-container');
  if (classList) {
    dropdownCotainer = applyClassList(dropdownCotainer, classList);
  }
  return dropdownCotainer;
}


export type useDivType = {
  getDiv: () => HTMLDivElement,
  setDiv: (classList?: string) => void
};

export const useDiv = () : useDivType => {
  let div : undefined | HTMLDivElement;

  const getDiv = () => {
    return div as HTMLDivElement;
  }

  const setDiv = (classList?: string) => {
    div = Div(classList);
  }

  return {
    getDiv,
    setDiv
  }
}

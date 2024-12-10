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


export type useStateType = {
  get: () => any,
  set: (item: any) => void,
  remove: () => any
};

export const useState = () : useStateType => {

  let item : any = undefined;

  const get = () : any => {
    return item;
  }

  const set = (itemValue: any) => {
    item =  itemValue;
  }

  const remove = () =>{
    item = undefined;
  }

  return {
    get,
    set,
    remove
  }
}

export type useDivType = {
  getDiv: () => HTMLDivElement,
  setDiv: (classList?: string) => void,
  removeDiv: () => void
};

export const useDiv = () : useDivType => {
  let div : undefined | HTMLDivElement;

  const getDiv = () => {
    return div as HTMLDivElement;
  }

  const setDiv = (classList?: string) => {
    div = Div(classList);
  }

  const removeDiv = () => {
    if (getDiv()) {
      (getDiv() as HTMLDivElement).remove()
    }
    div = undefined
  }

  return {
    getDiv,
    setDiv,
    removeDiv
  }
}

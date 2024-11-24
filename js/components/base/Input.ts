import {applyClassList, createEL} from '../../utils/index.js';

export const Label = (classList?: string) : HTMLLabelElement => {
  let label = createEL('label') as HTMLLabelElement;
  if (classList) {
    label = applyClassList(label, classList);
  }
  return label;
}

export const Input = (name: string, value: string, id: string, classList?: string) : HTMLInputElement => {
  let input = createEL('input') as HTMLInputElement;
  if (classList) {
    input = applyClassList(input, classList);
  }
  input.setAttribute('name', name);
  input.setAttribute('value', value);
  input.setAttribute('id', id);
  return input;
}

export const TextInput = (name: string, value: string, id: string, classList?: string) => {
  const input = Input(name, value, id);
  input.setAttribute('type', 'text');
  return input;
}

export const CheckboxInput = (name: string, value: string, id: string, classList?: string) => {
  const input = Input(name, value, id);
  input.setAttribute('type', 'checkbox');
  return input;
}

export const RadioInput = (name: string, value: string, id: string, classList?: string) => {
  const input = Input(name, value, id);
  input.setAttribute('type', 'radio');
  return input;
}

import { applyClassList, createEL } from '@utils/index';

export const Label = (classList?: string): HTMLLabelElement => {
  let label = createEL('label') as HTMLLabelElement;
  if (classList) {
    label = applyClassList(label, classList);
  }
  return label;
};

export const Input = (
  name: string,
  value: string,
  id: string,
  classList?: string,
): HTMLInputElement => {
  let input = createEL('input') as HTMLInputElement;
  if (classList) {
    input = applyClassList(input, classList);
  }
  input.setAttribute('name', name);
  input.setAttribute('value', value);
  input.setAttribute('id', id);
  return input;
};

export const TextInput = (
  name: string,
  value: string,
  id: string,
  classList?: string,
) => {
  const input = Input(name, value, id, classList);
  input.setAttribute('type', 'text');
  return input;
};

export const CheckboxInput = (
  name: string,
  value: string,
  id: string,
  classList?: string,
) => {
  const input = Input(name, value, id, classList);
  input.setAttribute('type', 'checkbox');
  return input;
};

export const RadioInput = (
  name: string,
  value: string,
  id: string,
  classList?: string,
) => {
  const input = Input(name, value, id, classList);
  input.setAttribute('type', 'radio');
  return input;
};

export type useTextInputType = {
  getInput: () => HTMLInputElement;
  setInput: (
    name: string,
    value: string,
    id: string,
    classList?: string,
  ) => void;
  removeInput: () => void;
};

export const useTextInput = (): useTextInputType => {
  let input: undefined | HTMLInputElement;

  const getInput = () => {
    return input as HTMLInputElement;
  };

  const setInput = (
    name: string,
    value: string,
    id: string,
    classList?: string,
  ) => {
    input = TextInput(name, value, id, classList);
  };

  const removeInput = () => {
    if (getInput()) {
      (getInput() as HTMLButtonElement).remove();
    }
    input = undefined;
  };

  return {
    getInput,
    setInput,
    removeInput,
  };
};

export type useFormType = {
  getForm: () => HTMLFormElement;
  setForm: (
    name: string,
    onSubmit: (e: any) => void,
    classList?: string,
  ) => void;
  removeForm: () => void;
};

export const useForm = (): useFormType => {
  let form: undefined | HTMLFormElement;

  const getForm = () => {
    return form as HTMLFormElement;
  };

  const setForm = (
    name: string,
    onSubmit: (e: any) => void,
    classList?: string,
  ) => {
    let f = createEL('form') as HTMLFormElement;
    if (classList) {
      f = applyClassList(f, classList) as HTMLFormElement;
    }
    f.setAttribute('name', name);
    f.addEventListener('submit', onSubmit);
    form = f as HTMLFormElement;
  };

  const removeForm = () => {
    if (getForm()) {
      (getForm() as HTMLFormElement).remove();
    }
    form = undefined;
  };

  return {
    getForm,
    setForm,
    removeForm,
  };
};

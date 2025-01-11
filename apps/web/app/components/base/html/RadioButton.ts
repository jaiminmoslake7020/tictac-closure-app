import { CheckboxInput, Label } from './Input';
import { Span } from './Text';

export const RadioButton = (
  labelText: string,
  inputChangeFunction: EventListenerOrEventListenerObject,
) => {
  const label = Label('radio-btn');
  const input = CheckboxInput(labelText, labelText, 'input-' + labelText);
  input.addEventListener('change', inputChangeFunction);
  label.append(input);
  const span = Span(labelText);
  label.append(span);
  return label as HTMLLabelElement;
};

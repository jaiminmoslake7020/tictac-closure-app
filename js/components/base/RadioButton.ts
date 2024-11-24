import {CheckboxInput, Label} from './Input.js';
import {Span} from './Text.js';

export const RadioButton = (labelText: string, inputChangeFunction: EventListenerOrEventListenerObject) => {
  const label = Label();
  const input = CheckboxInput( labelText, labelText, 'input-'+labelText );
  input.addEventListener('change', inputChangeFunction);
  label.append(input);
  const span = Span(labelText);
  label.append(span);
  return label as HTMLLabelElement;
}

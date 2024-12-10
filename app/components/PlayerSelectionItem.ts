import {useDiv} from './base/Div';
import {RadioButton} from './base/RadioButton';

export type PlayerSelectionItemType = {
  render: () => HTMLDivElement,
  remove: () => void
};

export const PlayerSelectionItem = (label:string, onChange: (e:any) => void) : PlayerSelectionItemType => {
  const {
    getDiv, setDiv, removeDiv
  } = useDiv();

  const render = () => {
    setDiv('player-selection-item-group');
    const rb = RadioButton(label, onChange);
    getDiv().append(rb);
    return getDiv();
  }

  const remove = () => {
    removeDiv();
  }

  return {
    render, remove
  };
}

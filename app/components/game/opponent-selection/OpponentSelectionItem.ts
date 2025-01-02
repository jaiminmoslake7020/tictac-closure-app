import {useDiv, RadioButton} from '@components/base';

export type OpponentSelectionItemType = {
  render: () => HTMLDivElement,
  remove: () => void
};

export const OpponentSelectionItem = (label:string, onChange: (e:any) => void) : OpponentSelectionItemType => {
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

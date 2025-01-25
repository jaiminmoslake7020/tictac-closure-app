import { useDiv } from '@components/base';
import { RadioButton } from '@components/base';

export type RoomSelectionItemType = {
  render: () => HTMLDivElement;
  remove: () => void;
};

export const RoomSelectionItem = (
  label: string,
  onChange: (e: any) => void
): RoomSelectionItemType => {
  const { getDiv, setDiv, removeDiv } = useDiv();

  const render = () => {
    setDiv('room-selection-item-group');
    const rb = RadioButton(label, onChange);
    getDiv().append(rb);
    return getDiv();
  };

  const remove = () => {
    removeDiv();
  };

  return {
    render,
    remove,
  };
};

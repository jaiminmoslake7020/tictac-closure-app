import { OpponentType } from '@types-dir/index';
import { useDiv, useForm } from '@components/base';
import { History } from '@utils/index';
import {
  OpponentSelectionItem,
  type OpponentSelectionItemType,
} from './OpponentSelectionItem';
import { opponentFormButtonTypeList } from '@data/index';

export type OpponentSelectionFormType = {
  render: () => HTMLDivElement;
  remove: () => void;
};

export const OpponentSelectionForm = (
  onPlayerSelected: (v: OpponentType) => Promise<void> | void
): OpponentSelectionFormType => {
  const { getDiv, setDiv } = useDiv();
  const { getForm, setForm } = useForm();

  const { pushState } = History();
  let playerItems = [] as OpponentSelectionItemType[];

  const onFormSubmit = (e: any) => {
    e.preventDefault();
  };

  const render = () => {
    // console.log('Showing Opponent Selection Form');
    setDiv('player-selection');
    setForm('player-selection-form', onFormSubmit, 'player-selection-form');

    opponentFormButtonTypeList.forEach(({ label, value }) => {
      const item1 = OpponentSelectionItem(label, async () => {
        remove();
        await onPlayerSelected(value as OpponentType);
      });
      playerItems.push(item1);
      getForm().append(item1.render());
    });

    getDiv().append(getForm());
    pushState('#/opponent-selection');
    return getDiv();
  };

  const remove = () => {
    playerItems.forEach((item) => {
      item.remove();
    });
    playerItems = [];
    getForm().remove();
    getDiv().remove();
  };

  return {
    render,
    remove,
  };
};

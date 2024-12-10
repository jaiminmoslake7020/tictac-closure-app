import {OpponentType, PlayerType} from '../types';
import {useDiv} from './base/Div';
import {useForm} from './base/Input';
import {History} from '../utils';
import {PlayerSelectionItem, PlayerSelectionItemType} from './PlayerSelectionItem';

export type PlayerSelectionType = {
  render : () => HTMLDivElement,
  remove : () => void
};

export const PlayerSelection = (onPlayerSelected: (v: OpponentType) => void) :PlayerSelectionType => {
  const {
    getDiv, setDiv
  } = useDiv();
  const {
    getForm, setForm
  } = useForm();

  const { pushState } = History();
  let playerItems = [] as PlayerSelectionItemType[];

  const onFormSubmit = (e:any) => {
    e.preventDefault();
  }

  const players = [{
    label: 'Remote Random Player',
    value: 'remote-random-player'
  }, {
    label: 'Remote Friend Player',
    value: 'remote-friend-player'
  }, {
    label: 'Computer Program',
    value: 'computer-program'
  },  {
    label: 'Same Device Play',
    value: 'same-device-play'
  }] as PlayerType[];

  const render = () => {
    setDiv('player-selection');
    setForm('player-selection-form', onFormSubmit, 'player-selection-form');

    players.forEach(({label,value}) => {
      const item1 = PlayerSelectionItem(label, () => {
        remove();
        onPlayerSelected(value as OpponentType);
      });
      playerItems.push(item1);
      getForm().append(item1.render());
    });

    getDiv().append(getForm());

    pushState('#/opponent-selection');
    return getDiv();
  }

  const remove = () => {
    playerItems.forEach((item) => {
      item.remove();
    })
    playerItems = [];
    getForm().remove();
    getDiv().remove();
  }

  return {
    render,
    remove
  };
}

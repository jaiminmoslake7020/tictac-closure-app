import {OpponentType, PlayerType} from '@types-dir/index';
import { useDiv, useForm } from '@components/base';
import {History} from '@utils/index';
import {PlayerSelectionItem, type PlayerSelectionItemType} from './PlayerSelectionItem';
import {IconButton} from '@components/base/html/Button';
import {NotificationSecondaryAction} from '@components/base/ux/notification/NotificationSecondaryAction';
import {NotificationHandler} from '@components/base/ux/notification/NotificationHandler';

export type PlayerSelectionType = {
  render : () => HTMLDivElement,
  remove : () => void
};

export const PlayerSelection = (onPlayerSelected: (v: OpponentType) => Promise<void> | void) :PlayerSelectionType => {
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

  // {
  //   label: 'Remote Random Player',
  //     value: 'remote-random-player'
  // }

  const players = [ {
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
      const item1 = PlayerSelectionItem(label, async () => {
        remove();
        await onPlayerSelected(value as OpponentType);
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

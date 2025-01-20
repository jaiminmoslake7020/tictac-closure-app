import { useDiv } from '@components/base';

export type NotificationSecondaryActionType = {
  render: () => HTMLDivElement;
  remove: () => void;
};

export const NotificationSecondaryAction = (
  content: HTMLElement,
): NotificationSecondaryActionType => {
  const { setDiv, getDiv, removeDiv } = useDiv();

  const { setDiv: setDivOne, getDiv: getDivOne, removeDiv: removeDivOne } = useDiv();

  const render = () => {
    setDiv('notification-secondary-action-wrapper');
    setDivOne('notification-secondary-action');
    getDivOne().append(content);
    getDiv().append(getDivOne());
    return getDiv();
  };

  const remove = () => {
    content.remove();
    removeDivOne();
    removeDiv();
  };

  return {
    render,
    remove,
  };
};

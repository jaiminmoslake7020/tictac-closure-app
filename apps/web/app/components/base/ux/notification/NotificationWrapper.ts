import { useDiv } from '@components/base';

export type NotificationWrapperType = {
  render: () => HTMLDivElement;
  remove: () => void;
};

export const NotificationWrapper = (): NotificationWrapperType => {
  const { setDiv, getDiv, removeDiv } = useDiv();

  const { setDiv: setDivOne, getDiv: getDivOne, removeDiv: removeDivOne } = useDiv();

  const render = () => {
    setDiv('notification-wrapper');
    setDivOne('notification');
    getDiv().append(getDivOne());
    return getDiv();
  };

  const remove = () => {
    removeDiv();
    removeDivOne();
  };

  return {
    render,
    remove,
  };
};

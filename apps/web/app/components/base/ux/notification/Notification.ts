import { H2, P, useDiv } from '@components/base';
import { IconButton } from '@components/base/html/Button';
import { NotificationSecondaryActionType } from '@components/base/ux/notification/NotificationSecondaryAction';

export type NotificationTypeType = 'info' | 'success' | 'warning' | 'error';

export type NotificationType = {
  id: string;
  title: string;
  message: string;
  type: NotificationTypeType;
  timeout: number | null;
  secondaryAction?: NotificationSecondaryActionType;
};

export type NotificationElementType = {
  render: () => HTMLDivElement;
  remove: () => void;
};

export const Notification = (
  notification: NotificationType
): NotificationElementType => {
  const { setDiv, getDiv, removeDiv } = useDiv();

  const {
    setDiv: setDivOne,
    getDiv: getDivOne,
    removeDiv: removeDivOne,
  } = useDiv();

  const {
    setDiv: setDivTwo,
    getDiv: getDivTwo,
    removeDiv: removeDivTwo,
  } = useDiv();

  const { setDiv: setDivThree, getDiv: getDivThree } = useDiv();

  const { setDiv: setDivFour, getDiv: getDivFour } = useDiv();

  const { setDiv: setDivFive, getDiv: getDivFive } = useDiv();

  const addTitle = () => {
    setDivThree('notification-title');
    getDivThree().append(H2(notification.title));
    getDivOne().append(getDivThree());
  };

  const addMessage = () => {
    setDivTwo('notification-message');
    getDivTwo().append(P(notification.message));
    getDivOne().append(getDivTwo());
  };

  const addSecondaryAction = () => {
    if (notification.secondaryAction) {
      setDivFive('notification-item-secondary-action-wrapper');
      getDivFive().append(notification.secondaryAction.render());
      getDivOne().append(getDivFive());
    }
  };

  const addCloseButton = () => {
    setDivFour('notification-close');
    const b = IconButton('', 'notification-close-btn', 'fas fa-times', remove);
    getDivFour().append(b);
    getDivOne().append(getDivFour());
  };

  const handleTimeout = () => {
    if (notification.timeout) {
      setTimeout(() => {
        remove();
      }, notification.timeout);
    }
  };

  const render = () => {
    setDiv('notification-item-wrapper');
    setDivOne(`notification-item notification-${notification.type}`);

    addCloseButton();
    addTitle();
    addMessage();
    addSecondaryAction();

    getDiv().append(getDivOne());

    handleTimeout();
    return getDiv();
  };

  const remove = () => {
    if (notification.secondaryAction) {
      notification.secondaryAction.remove();
    }
    removeDivTwo();
    removeDivOne();
    removeDiv();
  };

  return {
    render,
    remove,
  };
};

import {
  Notification,
  NotificationType,
  NotificationTypeType,
} from '@components/base/ux/notification/Notification';
import { NotificationSecondaryActionType } from '@components/base/ux/notification/NotificationSecondaryAction';

export type ErrorNotificationType = NotificationType & {
  type: 'error';
};

export type InfoNotificationType = NotificationType & {
  type: 'info';
};

export type SuccessNotificationType = NotificationType & {
  type: 'success';
};

export type WarningNotificationType = NotificationType & {
  type: 'warning';
};

export type NotificationHandlerType = {
  addError: (
    message: string,
    timeout: null | number,
    secondaryAction?: NotificationSecondaryActionType
  ) => {
    id: string;
    remove: () => void
  };
  addInfo: (
    message: string,
    timeout: null | number,
    secondaryAction?: NotificationSecondaryActionType
  ) => {
    id: string;
    remove: () => void
  };
  addSuccess: (
    message: string,
    timeout: null | number,
    secondaryAction?: NotificationSecondaryActionType
  ) => {
    id: string;
    remove: () => void
  };
  addWarning: (
    message: string,
    timeout: null | number,
    secondaryAction?: NotificationSecondaryActionType
  ) => {
    id: string;
    remove: () => void
  };
  removeNotification: (id: string) => void;
};

export const NotificationHandler = (): NotificationHandlerType => {

  const addNotification = (d: NotificationType) => {
    const { render, remove } = Notification(d);
    document.querySelector('.notification')?.append(render());
    return { remove };
  };

  const createNotificationObject = (
    message: string,
    type: NotificationTypeType,
    timeout: null | number = 5000,
    secondaryAction?: NotificationSecondaryActionType
  ): NotificationType => {
    return {
      title: type.toUpperCase(),
      type,
      id: Math.random().toString(36).substring(7),
      message,
      timeout,
      secondaryAction,
    };
  };

  const addError = (
    message: string,
    timeout: null | number = 5000,
    secondaryAction?: NotificationSecondaryActionType
  ) => {
    const n = createNotificationObject(message, 'error', timeout, secondaryAction);
    const { remove } = addNotification(n);
    return {
      id: n.id,
      remove,
    };
  };

  const addInfo = (
    message: string,
    timeout: null | number = 5000,
    secondaryAction?: NotificationSecondaryActionType
  ) => {
    console.info('INFO', message);
    const n = createNotificationObject(message, 'info', timeout, secondaryAction);
    const {remove} = addNotification(n);
    return {
      id: n.id,
      remove,
    };
  };

  const addSuccess = (
    message: string,
    timeout: null | number = 5000,
    secondaryAction?: NotificationSecondaryActionType
  ) => {
    console.info('SUCCESS', message);
    const n = createNotificationObject(message, 'success', timeout, secondaryAction);
    const {remove} = addNotification(n);
    return {
      id: n.id,
      remove,
    };
  };

  const addWarning = (
    message: string,
    timeout: null | number = 5000,
    secondaryAction?: NotificationSecondaryActionType
  ) => {
    console.warn('WARNING', message);
    const n = createNotificationObject(message, 'warning', timeout, secondaryAction);
    const {remove} = addNotification(n);
    return {
      id: n.id,
      remove,
    };
  };

  const removeNotification = () => {
    // console.log('REMOVE NOTIFICATION', id);
  };

  return { addError, addInfo, addSuccess, addWarning, removeNotification };
};

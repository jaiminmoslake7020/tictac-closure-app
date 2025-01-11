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
    secondaryAction?: NotificationSecondaryActionType,
  ) => void;
  addInfo: (
    message: string,
    timeout: null | number,
    secondaryAction?: NotificationSecondaryActionType,
  ) => void;
  addSuccess: (
    message: string,
    timeout: null | number,
    secondaryAction?: NotificationSecondaryActionType,
  ) => void;
  addWarning: (
    message: string,
    timeout: null | number,
    secondaryAction?: NotificationSecondaryActionType,
  ) => void;
  removeNotification: (id: string) => void;
};

export const NotificationHandler = (): NotificationHandlerType => {
  const addNotification = (d: NotificationType) => {
    const n = Notification(d);
    document.querySelector('.notification')?.append(n.render());
  };

  const createNotificationObject = (
    message: string,
    type: NotificationTypeType,
    timeout: null | number = 5000,
    secondaryAction?: NotificationSecondaryActionType,
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
    secondaryAction?: NotificationSecondaryActionType,
  ) => {
    addNotification(
      createNotificationObject(message, 'error', timeout, secondaryAction),
    );
  };

  const addInfo = (
    message: string,
    timeout: null | number = 5000,
    secondaryAction?: NotificationSecondaryActionType,
  ) => {
    console.info('INFO', message);
    addNotification(
      createNotificationObject(message, 'info', timeout, secondaryAction),
    );
  };

  const addSuccess = (
    message: string,
    timeout: null | number = 5000,
    secondaryAction?: NotificationSecondaryActionType,
  ) => {
    console.info('SUCCESS', message);
    addNotification(
      createNotificationObject(message, 'success', timeout, secondaryAction),
    );
  };

  const addWarning = (
    message: string,
    timeout: null | number = 5000,
    secondaryAction?: NotificationSecondaryActionType,
  ) => {
    console.warn('WARNING', message);
    addNotification(
      createNotificationObject(message, 'warning', timeout, secondaryAction),
    );
  };

  const removeNotification = (id: string) => {
    // console.log('REMOVE NOTIFICATION', id);
  };

  return { addError, addInfo, addSuccess, addWarning, removeNotification };
};

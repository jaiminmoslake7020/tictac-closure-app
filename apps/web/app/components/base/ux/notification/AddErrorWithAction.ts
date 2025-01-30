import { IconButton } from '@components/base/html/Button';
import { NotificationSecondaryAction } from '@components/base/ux/notification/NotificationSecondaryAction';
import { NotificationHandler } from '@components/base/ux/notification/NotificationHandler';

export const AddErrorWithAction = (message: string, action: () => void) => {
  const ib = IconButton(
    'Re-create room',
    ' with-text ',
    'fa-solid fa-power-off',
    action
  );
  const n = NotificationSecondaryAction(ib as HTMLElement);
  const { addError } = NotificationHandler();
  addError(message, null, n);
};


export const AddErrorWithoutAction = (message: string) => {
  const { addError } = NotificationHandler();
  addError(message, null);
};


export const AddErrorWithCustomAction = (message: string, btnLable: string, action: () => void) => {
  const ib = IconButton(
    btnLable,
    ' with-text ',
    'fa-solid fa-power-off',
    () => {
      remove();
      action();
    }
  );
  const n = NotificationSecondaryAction(ib as HTMLElement);
  const { addError } = NotificationHandler();
  const {
    remove
  } = addError(message, null, n);
};

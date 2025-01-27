import { getUser } from '@session/UserSessionHandler';
import { getSession, setSession } from '@session/SessionHandler';
import { AppLevelType } from '@types-dir/index';

const AppLevelTypeSessionHandler = () => {
  const getAppLevelType = () => {
    if (getUser()) {
      return getSession().appLevelType;
    }
  };

  const setAppLevelType = (appLevelType: AppLevelType) => {
    if (getUser()) {
      setSession({
        ...getSession(),
        appLevelType,
      });
    }
  };

  const removeAppLevelType = () => {
    if (getUser()) {
      setSession({
        ...getSession(),
        appLevelType: undefined,
      });
    }
  };

  return {
    getAppLevelType,
    setAppLevelType,
    removeAppLevelType,
  };
};

const { getAppLevelType, setAppLevelType, removeAppLevelType } =
  AppLevelTypeSessionHandler();

export { getAppLevelType, setAppLevelType, removeAppLevelType };

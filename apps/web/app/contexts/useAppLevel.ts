import { AppLevelType } from '@types-dir/index';
import { appLevelList } from '@helpers/index';
import {
  setAppLevelType as setAppLevelTypeSession,
  getAppLevelType as getAppLevelTypeSession,
  removeAppLevelType as removeAppLevelTypeSession,
} from '@session/index';

export type UseAppLevelHookType = {
  getAppLevelType: () => AppLevelType;
  setAppLevelType: (v: AppLevelType) => void;
};

// hooks should be component based
export const useAppLevel = (): UseAppLevelHookType => {
  let appLevelType: undefined | AppLevelType;

  const setAppLevelType = (item: AppLevelType) => {
    setAppLevelTypeSession(item);
    appLevelType = item;
  };

  const getAppLevelType = (): AppLevelType => {
    const appLevelTypeStorage = getAppLevelTypeSession();
    if (appLevelTypeStorage && Object.keys(appLevelList).includes(appLevelTypeStorage)) {
      setAppLevelType(appLevelTypeStorage as AppLevelType);
    } else {
      removeAppLevelTypeSession();
    }
    return appLevelType as AppLevelType;
  };

  return {
    getAppLevelType,
    setAppLevelType,
  };
};

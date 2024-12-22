import {AppLevelType} from '@types-dir/index';
import {appLevelList} from '@helpers/index';

export type AppLevelHookType = {
  getAppLevelType: () => AppLevelType,
  setAppLevelType: (v:AppLevelType) => void,
};

// hooks should be component based
export const useAppLevel = () :AppLevelHookType => {
  let appLevelType: undefined | AppLevelType;

  const setAppLevelType = (item: AppLevelType) => {
    localStorage.setItem('appLevelType', item);
    appLevelType = item;
  }

  const getAppLevelType = () : AppLevelType => {
    const appLevelTypeStorage  = localStorage.getItem('appLevelType');
    if ( appLevelTypeStorage && Object.keys(appLevelList).includes( appLevelTypeStorage ) ) {
      setAppLevelType( appLevelTypeStorage as AppLevelType );
    } else if ( appLevelTypeStorage ) {
      localStorage.removeItem('appLevelType');
    }
    return appLevelType as AppLevelType;
  }

  return {
    getAppLevelType,
    setAppLevelType
  }
}


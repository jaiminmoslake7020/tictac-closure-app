import {AppLevelType} from '../types/index.js';
import {appLevelList} from '../helpers/index.js';

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

export type InitializeContextsFunctionType = {
  addContext: (name: string, value: any) => void,
  getContext: (name:string) => any,
  hasContext: (name:string) => boolean,
};

export const initializeContexts = () : InitializeContextsFunctionType => {
  const contexts = new Map();

  const addContext = (name: string, value: any) => {
    contexts.set(name, value);
  }

  const getContext = (name: string) => {
    return contexts.get(name);
  }

  const hasContext = (name: string) => {
    return contexts.has(name);
  }

  return {
    addContext,
    getContext,
    hasContext
  }
}

export type contextType = 'AppLevelType';

export const contextsMap = {
  AppLevelType: 'AppLevelType'
} as Record<contextType, contextType>;

// contexts should be global and share state between app or atlest nodeTree where it starts
export const useContexts = (contextName: string, contextsMapList : InitializeContextsFunctionType) => {

  const {
    addContext,
    getContext,
    hasContext
  } = contextsMapList;

  if (contextName === contextsMap.AppLevelType) {
    if ( hasContext(contextName) ) {
      return getContext(contextName);
    }
    const firstInstance = useAppLevel();
    addContext(contextName, firstInstance);
    return firstInstance as AppLevelHookType;
  }
}


export const useContextAppLevelType = (contextsData : InitializeContextsFunctionType) : AppLevelHookType => {
  return  useContexts( contextsMap.AppLevelType , contextsData ) as AppLevelHookType;
}

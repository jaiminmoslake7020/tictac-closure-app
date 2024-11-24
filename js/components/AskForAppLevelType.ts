import {AppLevelType} from '../types/index.js';
import {createEL} from '../utils/index.js';
import {appLevelList} from '../helpers/index.js';

export const AskForAppLevelType = ( onLevelSelected : (a: AppLevelType) =>  void , ignoreLocalStorage:boolean = false ) => {
  let appLevelType : undefined | AppLevelType;
  const f = createEL('form');

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

  const addLevelButton = (labelText: AppLevelType) => {
    const div = createEL('div');
    div.classList.add('level-selection-div');
    const label = createEL('label');
    const input = createEL('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', labelText);
    input.setAttribute('value', labelText);
    input.setAttribute('id', 'input-'+labelText);
    input.addEventListener('change', (e : Event) => {
      const t = e.target as EventTarget;
      // @ts-ignore
      if ( t?.value ) {
        // @ts-ignore
        setAppLevelType( t?.value );
        f.remove();
        onLevelSelected( getAppLevelType() );
      }
    });
    label.append(input);
    const span = createEL('span');
    span.innerHTML = labelText;
    label.append(span);
    div.append(label);
    return div as HTMLDivElement;
  }

  const addLevelButtonList = ( divRow : HTMLDivElement ) => {
    return Object.keys(appLevelList).forEach((k) => {
      divRow.append( addLevelButton(k as AppLevelType) );
    });
  }

  const render = () => {
    if (!ignoreLocalStorage && getAppLevelType()) {
      onLevelSelected(appLevelType as AppLevelType);
      return null;
    } else {
      const divRow = createEL('div') as HTMLDivElement;
      divRow.classList.add('input-row');
      addLevelButtonList( divRow );
      f.append(divRow)
      window.history.pushState(null, '', '#/app-level')
      return f as HTMLDivElement;
    }
  }

  return {
    render,
  }
}

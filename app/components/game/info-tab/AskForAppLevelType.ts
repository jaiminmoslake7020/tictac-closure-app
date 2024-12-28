import {AppLevelType} from '@types-dir/index';
import {createEL} from '@utils/index';
import {appLevelList} from '@helpers/index';
import {RadioButton} from '@components/base';
import {Div} from '@components/base';
import {InitializeContextsFunctionType, useContextAppLevelType} from '@contexts/index';

export const AskForAppLevelType = ( onLevelSelected : () =>  void , ignoreLocalStorage:boolean = false , contextsData: InitializeContextsFunctionType ) => {
  const f = createEL('form');

  const { getAppLevelType, setAppLevelType } = useContextAppLevelType( contextsData );

  const addLevelButton = (labelText: AppLevelType) => {
    const radioButton = RadioButton( labelText , (e : Event) => {
      const t = e.target as EventTarget;
      // @ts-ignore
      if ( t?.value ) {
        // @ts-ignore
        setAppLevelType( t?.value );
        f.remove();
        onLevelSelected();
      }
    });
    const div = Div('level-selection-div');
    div.append(radioButton);
    return div as HTMLDivElement;
  }

  const addLevelButtonList = ( divRow : HTMLDivElement ) => {
    return Object.keys(appLevelList).forEach((k) => {
      divRow.append( addLevelButton(k as AppLevelType) );
    });
  }

  const render = () => {
    if (!ignoreLocalStorage && getAppLevelType()) {
      onLevelSelected();
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

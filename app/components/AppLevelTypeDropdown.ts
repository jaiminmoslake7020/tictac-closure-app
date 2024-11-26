import {Button} from './base/Button';
import {AskForAppLevelType} from './AskForAppLevelType';
import {InitializeContextsFunctionType, useContextAppLevelType} from '../contexts';
import {Dropdown, DropdownContainer} from './base/Div';

export const AppLevelTypeDropdown = (contextsData: InitializeContextsFunctionType, onLevelChange: () => void) => {

  const { getAppLevelType } = useContextAppLevelType(contextsData);

  const onLevelSelected = (btn:HTMLButtonElement, dropdownDiv: HTMLDivElement) => {
    btn.innerHTML = getAppLevelType();
    dropdownDiv.remove();
    onLevelChange();
  }

  const render = () => {
    const dropdownContainer = DropdownContainer('dropdown-container-app-level-selector-box');

    const b = Button( getAppLevelType(), 'btn' , (e) => {
      const btn = e.target as HTMLButtonElement;
      const dropdownDiv = Dropdown('dropdown-app-level-selector-box');
      const a = AskForAppLevelType( onLevelSelected.bind(null, btn, dropdownDiv), true , contextsData);
      const d = a.render();
      if (d) {
        dropdownDiv.append(d);
        dropdownContainer.append(dropdownDiv);

      }
    });

    dropdownContainer.append(b);
    return dropdownContainer;
  }

  return {
    render
  }
}

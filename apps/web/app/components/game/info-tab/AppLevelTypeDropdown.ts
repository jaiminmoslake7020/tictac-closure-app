import { Button, Dropdown, DropdownContainer } from '@components/base';
import { AskForAppLevelType } from './AskForAppLevelType';
import {
  InitializeContextsFunctionType,
  useContextAppLevelType,
} from '@contexts/index';

export const AppLevelTypeDropdown = (
  contextsData: InitializeContextsFunctionType,
  onLevelChange: () => void,
) => {
  const { getAppLevelType } = useContextAppLevelType(contextsData);

  let opened: boolean = false;

  const getOpened = (): boolean => {
    return opened;
  };

  const setOpened = (item: boolean) => {
    opened = item;
  };

  let dropdownDivHtml: HTMLDivElement | undefined;

  const getDropdownDivHtml = (): HTMLDivElement | undefined => {
    return dropdownDivHtml;
  };

  const setDropdownDivHTML = (item: HTMLDivElement | undefined) => {
    dropdownDivHtml = item;
  };

  const onLevelSelected = (btn: HTMLButtonElement) => {
    btn.innerHTML = getAppLevelType();
    document.removeEventListener('click', clickFunction);
    remove();
    setOpened(false);
    onLevelChange();
  };

  const clickFunction = (e: any): void => {
    const target = e.target as Element;
    const currentOpened = getOpened();
    if (currentOpened) {
      if (!target?.closest('.dropdown')) {
        document.removeEventListener('click', clickFunction);
        remove();
        setOpened(false);
      }
    }
  };

  const render = () => {
    const dropdownContainer = DropdownContainer(
      'dropdown-container-app-level-selector-box',
    );

    const b = Button(getAppLevelType(), 'btn', (e) => {
      const btn = e.target as HTMLButtonElement;
      const dropdownDiv = Dropdown('dropdown-app-level-selector-box');
      const a = AskForAppLevelType(
        onLevelSelected.bind(null, btn),
        true,
        contextsData,
      );
      const d = a.render();
      setDropdownDivHTML(dropdownDiv);
      document.addEventListener('click', clickFunction);
      if (d) {
        dropdownDiv.append(d);
        dropdownContainer.append(dropdownDiv);
        setTimeout(() => {
          setOpened(true);
        }, 50);
      }
    });

    dropdownContainer.append(b);
    return dropdownContainer;
  };

  const remove = () => {
    if (getDropdownDivHtml()) {
      (getDropdownDivHtml() as HTMLDivElement).remove();
    }
    setDropdownDivHTML(undefined);
  };

  return {
    render,
  };
};

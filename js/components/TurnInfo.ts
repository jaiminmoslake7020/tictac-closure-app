import {createEL, findEl} from '../utils/index.js'
import {AppLevelType, TurnType, WinnerType} from '../types/index.js';
import {AskForAppLevelType} from './AskForAppLevelType.js';

let reloadTime = 20;

export const TurnInfo = (turn: TurnType, appLevel: AppLevelType, onLevelChange: (l:AppLevelType) => void) => {
  const div = createEL('div') as HTMLDivElement;
  const p = createEL('p') as HTMLParagraphElement;

  div.classList.add('info-tab');
  p.classList.add('info-p');

  const addRestartButtonText = ( button: HTMLButtonElement , reload : Function, time: number) => {
    if (time === 0) {
      reload();
    } else {
      button.innerHTML = 'Reload - '+time+'s';
      setTimeout(addRestartButtonText, 1000, button, reload, time - 1);
    }
  }

  const addRestartButton = ( reload : Function) => {
    const button = createEL('button');
    button.classList.add('btn');
    button.classList.add('btn-reload')
    button.classList.add('btn-animate');
    button.setAttribute('type','button')
    button.addEventListener('click', () => {
      reload();
    });
    button.innerHTML = 'Reload - '+reloadTime+'s';
    return button;
  }

  const changeAppLevelButton = () => {
    const div2 = createEL('div');
    div2.classList.add('dropdown-container');
    div2.classList.add('dropdown-container-app-level-selector-box');
    const b = createEL('button');
    b.setAttribute('type', 'button');
    b.classList.add('btn');
    b.innerHTML = appLevel;
    b.addEventListener('click', () => {
      const dropdownDiv = createEL('div');
      dropdownDiv.classList.add('dropdown');
      dropdownDiv.classList.add('dropdown-app-level-selector-box');
      const a = AskForAppLevelType( (l:AppLevelType) => {
        b.innerHTML = l;
        dropdownDiv.remove();
        onLevelChange(l);
      }, true);
      const d = a.render();
      if (d) {
        dropdownDiv.append(d);
        div2.append(dropdownDiv);
      }
    });
    div2.append(b);
    return div2;
  }

  const render = () => {
    p.innerHTML = 'You are "'+turn+'"';
    div.append(p);
    div.append(changeAppLevelButton());
    return div;
  }

  const update = (newTurn: TurnType, winner: WinnerType, reload: Function) => {
    if (winner) {
      p.classList.add('winner-found');
      if (winner === "NONE") {
        p.innerHTML = 'You both loose.';
      } else if (winner === "X") {
        p.classList.add('you-lost');
        p.innerHTML = 'Found Winner: "X"';
      } else {
        p.classList.add('you-win');
        p.innerHTML = 'Found Winner: "O"';
      }
      div.append(addRestartButton( reload ));
      setTimeout(addRestartButtonText, 1000, findEl('.btn.btn-reload'), reload, reloadTime - 1);
    }
  }

  const reset = ( turn : TurnType ) => {
    div.querySelector('button.btn-reload')?.remove();
    if (div.querySelector('p')) {
      // @ts-ignore
      div.querySelector('p')?.innerHTML = 'You are "'+turn+'"';
      const classList = ['winner-found', 'you-lost', 'you-win'];
      classList.map((classitem: string) => {
        if ( div.querySelector('p')?.classList.contains(classitem) ) {
          div.querySelector('p')?.classList.remove(classitem);
        }
      });
    }
  }

  return {
    render,
    update,
    reset
  }
}

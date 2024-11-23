import { createEL } from '../utils/index.js'
import {TurnType, WinnerType} from '../types/index.js';

export const TurnInfo = (turn: TurnType) => {
  const div = createEL('div') as HTMLDivElement;
  const p = createEL('p') as HTMLParagraphElement;

  div.classList.add('info-tab');
  p.classList.add('info-p');

  const addRestartButton = ( reload : Function) => {
    const button = createEL('button');
    button.classList.add('btn');
    button.classList.add('btn-reload')
    button.setAttribute('type','button')
    button.addEventListener('click', () => {
      // window.location.reload();
      reload();
    });
    button.innerHTML = 'Reload';
    return button;
  }

  const render = () => {
    p.innerHTML = 'You are "'+turn+'"';
    div.append(p);
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
    }
  }

  const reset = ( turn : TurnType ) => {
    div.querySelector('button')?.remove();
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

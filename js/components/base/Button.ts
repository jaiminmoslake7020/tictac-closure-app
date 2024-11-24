import {createEL} from '../../utils/index.js';

export const Button = (btnLabel: string, btnClassList: string, onClick: EventListenerOrEventListenerObject ) : HTMLButtonElement => {
  const button = createEL('button') as HTMLButtonElement;
  btnClassList.trim().split(' ').forEach((classItem: string) => {
    button.classList.add( classItem.trim() );
  });
  button.setAttribute('type', 'button');
  button.addEventListener('click', onClick );
  button.innerHTML = btnLabel;
  return button;
}

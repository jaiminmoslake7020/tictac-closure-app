import { createEL, findEl } from '@utils/index';

export const AddStyle = (className: string, cssStyleClassData: string) => {
  let styleEl = findEl('#style');
  if (styleEl === null) {
    styleEl = createEL('style');
    styleEl.setAttribute('id', 'style');
    styleEl.innerHTML = '';
    document.head.append(styleEl);
  }
  if (!styleEl.innerHTML.includes(className)) {
    const oldHtml = styleEl.innerHTML;
    styleEl.innerHTML = oldHtml + '\n' + cssStyleClassData;
  }
};

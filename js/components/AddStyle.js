import { createEL, findEl } from '../utils/index.js';

export const AddStyle = (className, cssStyleClassData) => {
  let styleEl = findEl('#style');
  if (styleEl === null) {
    styleEl = createEL('style');
    styleEl.setAttribute('id','style')
    styleEl.innerHTML = '';
    document.head.append(styleEl);
  }
  if (!styleEl.innerHTML.includes(className)) {
    const oldHtml = styleEl.innerHTML;
    styleEl.innerHTML = oldHtml+'\n'+cssStyleClassData;
  }
}

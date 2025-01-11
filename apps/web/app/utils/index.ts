export const createEL = (identifier: string): Element => {
  return document.createElement(identifier) as Element;
};

export const findEl = (identifier: string): Element => {
  return document.querySelector(identifier) as Element;
};

export const addInnerHtml = (identifier: string, html: string) => {
  const el = findEl(identifier);
  el.innerHTML = html;
};

export const appendEl = (identifier: string, anotherEL: HTMLElement) => {
  const el = findEl(identifier);
  el.append(anotherEL);
  return el;
};

export const addToRoot = (anotherEL: HTMLElement) => {
  const identifier = '#root';
  findEl(identifier).innerHTML = '';

  appendEl('#root', anotherEL);
};

export const applyClassList = (
  el: any | HTMLElement,
  classList: string,
): any | HTMLElement => {
  classList
    .trim()
    .split(' ')
    .forEach((classItem: string) => {
      const cl = classItem.trim();
      if (cl) {
        el.classList.add(cl);
      }
    });
  return el;
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // The +1 ensures the max is inclusive
};

export type HistoryType = {
  pushState: (url: string) => void;
  replaceState: (url: string) => void;
};

export const History = (): HistoryType => {
  const pushState = (url: string) => {
    window.history.pushState(null, 'undefined', url);
  };

  const replaceState = (url: string) => {
    window.history.replaceState(null, 'undefined', url);
  };

  return {
    pushState,
    replaceState,
  };
};

export const getBrowserName = () => {
  const userAgent = navigator.userAgent;
  if (
    userAgent.includes('Chrome') &&
    !userAgent.includes('Edg') &&
    !userAgent.includes('OPR')
  ) {
    return 'Google Chrome';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'Safari';
  } else if (userAgent.includes('Firefox')) {
    return 'Mozilla Firefox';
  } else if (userAgent.includes('Edg')) {
    return 'Microsoft Edge';
  } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
    return 'Opera';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    return 'Internet Explorer';
  } else {
    return 'Unknown Browser';
  }
};

export const copyTextToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // console.log('Text copied to clipboard');
    })
    .catch((err) => {
      console.error('Failed to copy text: ', err);
    });
};

export const getCurrentTime = (): number => {
  return new Date().getTime();
};

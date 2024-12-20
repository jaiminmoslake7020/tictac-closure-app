import {applyClassList, createEL} from '../../../utils';

export const Text = (as: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',text: string, classList?: string) => {
  let el = createEL(as);
  if (classList) {
    el = applyClassList(el, classList);
  }
  el.innerHTML = text;
  return el;
}

export const P = (text: string, classList?: string) :HTMLParagraphElement => {
  return Text('p', text, classList) as HTMLParagraphElement;
}

export const Span = (text: string, classList?: string) : HTMLSpanElement => {
  return Text('span', text, classList) as HTMLSpanElement;
}

export const H1 = (text: string, classList?: string) : HTMLHeadingElement => {
  return Text('h1', text, classList) as HTMLHeadingElement;
}
export const H2 = (text: string, classList?: string) : HTMLHeadingElement => {
  return Text('h2', text, classList) as HTMLHeadingElement;
}
export const H3 = (text: string, classList?: string) : HTMLHeadingElement => {
  return Text('h3', text, classList) as HTMLHeadingElement;
}
export const H4 = (text: string, classList?: string) : HTMLHeadingElement => {
  return Text('h4', text, classList) as HTMLHeadingElement;
}
export const H5 = (text: string, classList?: string) : HTMLHeadingElement => {
  return Text('h5', text, classList) as HTMLHeadingElement;
}
export const H6 = (text: string, classList?: string) : HTMLHeadingElement => {
  return Text('h6', text, classList) as HTMLHeadingElement;
}

export type useSpanType = {
  getSpan: () => HTMLButtonElement,
  setSpan: (classList?: string) => void,
  removeSpan: () => void
};

export const useSpan = () : useSpanType => {
  let span : undefined | HTMLSpanElement;

  const getSpan = () => {
    return span as HTMLButtonElement;
  }

  const setSpan = (classList?: string) => {
    span = Span('', classList);
  }

  const removeSpan = () => {
    if (getSpan()) {
      (getSpan() as HTMLSpanElement).remove()
    }
    span = undefined
  }

  return {
    getSpan,
    setSpan,
    removeSpan
  }
}

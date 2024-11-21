export const createEL = (identifier: string) :Element => {
  return document.createElement(identifier) as Element;
}

export const findEl = (identifier: string) : Element => {
  return document.querySelector(identifier) as Element;
}

export const addInnerHtml = (identifier: string, html: string) => {
  const el = findEl(identifier);
  el.innerHTML = html;
}

export const appendEl = (identifier: string, anotherEL: HTMLElement) => {
  const el = findEl(identifier);
  el.append(anotherEL);
  return el;
}

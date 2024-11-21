export const createEL = (identifier) => {
  return document.createElement(identifier);
}

export const findEl = (identifier) => {
  return document.querySelector(identifier)
}

export const addInnerHtml = (identifier, html) => {
  const el = findEl(identifier);
  el.innerHTML = html;
}

export const appendEl = (identifier, anotherEL) => {
  const el = findEl(identifier);
  el.append(anotherEL);
  return el;
}

import { appendEl } from '@utils/index';
import { H6, useDiv, useSpan, useState } from '@components/base/html';

export type LoaderType = {
  showLoader: () => void;
  stopLoader: () => void;
  addText: (text: string) => void;
};

export const Loader = () => {
  const { getDiv, setDiv, removeDiv } = useDiv();
  const { getDiv: getDivOne, setDiv: setDivOne, removeDiv: removeDivOne } = useDiv();
  const { getSpan, setSpan, removeSpan } = useSpan();
  const { set: setVarOne, get: getVarOne } = useState();

  const render = () => {
    setDiv('loading-wrapper');
    setDivOne('loading-wrapper-child');
    setSpan('loading-text fas fa-cog animate-spin  ');
    getDivOne().append(getSpan());
    getDiv().append(getDivOne());
    return getDiv();
  };

  const addText = (text: string) => {
    setVarOne(H6(text, 'loading-info-text'));
    getDivOne().append(getVarOne());
  };

  const updateText = (text: string) => {
    getVarOne().innerText = text;
  };

  const showLoader = () => {
    const d = render();
    appendEl('#root', d);
  };

  const stopLoader = () => {
    removeSpan();
    removeDivOne();
    removeDiv();
  };

  return {
    showLoader,
    stopLoader,
    addText,
    updateText,
  };
};

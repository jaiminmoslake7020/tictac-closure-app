import {appendEl} from '../../../utils';
import {
  useDiv, useSpan
} from '../html';

export type LoaderType = {
  showLoader: () => void,
  stopLoader: () => void
};

export const Loader = () => {
  const {getDiv, setDiv, removeDiv} = useDiv();
  const {getDiv: getDivOne, setDiv: setDivOne, removeDiv:removeDivOne } = useDiv();
  const {getSpan, setSpan, removeSpan} = useSpan();

  const render = () => {
    setDiv('loading-wrapper');
    setDivOne('loading-wrapper-child');
    setSpan('loading-text fas fa-cog animate-spin  ');
    getDivOne().append(getSpan());
    getDiv().append(getDivOne());
    return getDiv();
  }

  const showLoader = () => {
    const d = render();
    appendEl('#root', d);
  }

  const stopLoader = () => {
    removeSpan();
    removeDivOne();
    removeDiv();
  }

  return {
    showLoader,
    stopLoader
  }
}

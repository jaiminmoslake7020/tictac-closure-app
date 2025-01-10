import './css/style.scss';
import {App} from '@components/index';
import {initSession} from '@session/index';

window.addEventListener('load',  () => {
  initSession();
  const app = App();
  app.init();
});




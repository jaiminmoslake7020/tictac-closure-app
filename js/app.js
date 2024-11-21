import { App } from './components/App.js';

window.addEventListener('load', () => {
  const app = App();
  app.init();
});


window.addEventListener('load', (event) => {
  console.log('Page is fully loaded, including images and stylesheets');
});

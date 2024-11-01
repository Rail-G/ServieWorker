import NewsController from './news/index';

if (navigator.serviceWorker) {
  window.addEventListener('load', async () => {
    try {
      if (navigator.serviceWorker) {
        await navigator.serviceWorker.register('./service-worker.js');
        console.log('sw registered');
      }
    } catch (e) {
      console.log(e);
    }
  });
}

const obj = new NewsController();
obj.init();

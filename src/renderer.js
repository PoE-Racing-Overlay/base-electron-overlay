import { createApp } from 'vue';
import App from './renderer/App.vue';
import router from './renderer/router';
import store from './renderer/store';

createApp(App)
  .use(store)
  .use(router)
  .use(app => {
    app.config.globalProperties.$ipc = window.ipcRenderer;
  })
  .mount('#app');

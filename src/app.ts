import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import App from './App.vue';
import { createRouter } from './router/index';
import { createStore } from './store/index';
import './registerServiceWorker';

Vue.config.productionTip = false;

export const createApp = () => {
  const router = createRouter();
  const store = createStore();

  // ルートの状態をストアの一部として利用できるよう同期
  sync(store, router);

  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  });
  // マウントする処理(`.$mount`)は削除

  return { app, router, store };
};


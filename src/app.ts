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

  // ここで router と store を挿入することで
  // `this.$router` と `this.$store` が使えるようになる
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  });

  return { app, router, store };
};
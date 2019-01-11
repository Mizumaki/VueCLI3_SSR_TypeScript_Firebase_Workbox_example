import Vue from 'vue';
import Vuex from 'vuex';
import statham from './modules/statham';

Vue.use(Vuex);

// module分けについては[こちらなど](https://github.com/vuejs/vuex/tree/dev/examples/shopping-cart/store)を参照

export const createStore = () => {
  return new Vuex.Store({
    modules: {
      statham: statham
      // これで、"statham"という名前空間に `statham` モジュールが登録された
      // https://vuex.vuejs.org/ja/guide/modules.html#名前空間
    }
  });
}

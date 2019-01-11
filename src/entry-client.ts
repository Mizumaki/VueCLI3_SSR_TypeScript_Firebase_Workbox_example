import Vue from 'vue';
import { createApp } from './app';
import ProgressBar from './components/ProgressBar.vue';

// global progress bar
const bar: any = Vue.prototype.$bar = new Vue(ProgressBar).$mount();
document.body.appendChild(bar.$el);

// $mountについて　https://v1-jp.vuejs.org/api/#vm-mount
// $elについて　https://jp.vuejs.org/v2/api/index.html#vm-el

// ルートコンポーネントが再利用されたとき（つまりルートは同じだがパラメーターやクエリが変わったとき。例えば user/1 から user/2) も
// asyncDataを呼ぶ
// https://ssr.vuejs.org/ja/guide/data.html#クライアントサイドのデータ取得
Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData } = (this as any).$options
    if (asyncData) {
      asyncData({
        store: (this as any).$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

const { app, router, store } = createApp();

interface IWindow { __INITIAL_STATE__: any; addEventListener: any; }
declare var window: IWindow;

// SSRによりstoreが更新された際に、それがクライアント側にも反映されるようにする
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  // asyncData を扱うためにルーターのフックを追加します。これは初期ルートが解決された後に実行します
  // そうすれば（訳注: サーバーサイドで取得したために）既に持っているデータを冗長に取得しなくて済みます
  // すべての非同期なコンポーネントが解決されるように router.beforeResolve() を使います
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // まだ描画されていないコンポーネントにのみ関心を払うため、　＝＞　
    // 2つの一致したリストに差分が表れるまで、コンポーネントを比較します
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activated.length) {
      return next();
    }

    // 他のアプローチとして、asyncData が存在するコンポーネントを読み込む場合にのみ、
    // インジケーターを表示させるようなものもある
    // https://github.com/vuejs/vue-hackernews-2.0/blob/master/src/entry-client.js

    // ここでローディングインジケーターを開始
    bar.start();
    Promise.all(activated.map((c: any) => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to });
      }
    })).then(() => {
      // ローディングインジケーターを停止させます
      bar.finish();
      next();
    }).catch(next)
  })
  app.$mount('#app')
});

// service worker
if ('https:' === location.protocol) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
}
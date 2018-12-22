import { createApp } from './app';

const { app } = createApp();
// const { app, router, store } = createApp();

app.$mount('#app');

/* http://bit.ly/2SSzXuF

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

    // まだ描画されていないコンポーネントにのみ関心を払うため、
    // 2つの一致したリストに差分が表れるまで、コンポーネントを比較します
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activated.length) {
      return next()
    }

    // もしローディングインジケーターがあるならば、
    // この箇所がローディングインジケーターを発火させるべき箇所です

    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to })
      }
    })).then(() => {

      // ローディングインジケーターを停止させます

      next()
    }).catch(next)
  })
  app.$mount('#app')
})
*/
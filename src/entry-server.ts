import { createApp } from './app';

const isDev = process.env.NODE_ENV !== 'production';

export default (context: any) => {
  return new Promise((resolve, reject) => {
    let s: number;
    if (isDev) {
      s = Date.now();
    }
    const { app, router, store } = createApp();

    // ルーターに現在のurlをセット
    router.push(context.url)

    // コンポーネントに asyncData メソッドがあった場合に、解決を待つ
    // https://ssr.vuejs.org/ja/guide/data.html#ロジックとコンポーネントとの結び付き
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();

      if (!matchedComponents.length) {
        reject({ code: 404 })
      }

      // 一致したルートコンポーネントに asyncData() が含まれる場合に処理 
      Promise.all(matchedComponents.map((Component: any) => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`);
        // すべての asyncData が解決されると、ストアには、
        // アプリケーションを描画するために必要とされる状態が入っています。
        // 状態を context に付随させ、`template` オプションがレンダラに利用されると、
        // 状態は自動的にシリアライズされ、HTML 内に `window.__INITIAL_STATE__` として埋め込まれます
        context.state = store.state
        resolve(app);
      }).catch(reject);
    }, reject)
  })
}
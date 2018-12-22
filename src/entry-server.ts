import { createApp } from './app'

export default (context: any) => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();

      if (!matchedComponents.length) {
        reject({ code: 404 })
      }

      /*
      // 一致したルートコンポーネントすべての asyncData() を呼び出します 
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // すべてのプリフェッチのフックが解決されると、ストアには、
        // アプリケーションを描画するために必要とされる状態が入っています。
        // 状態を context に付随させ、`template` オプションがレンダラに利用されると、
        // 状態は自動的にシリアライズされ、HTML 内に `window.__INITIAL_STATE__` として埋め込まれます
        context.state = store.state
        resolve(app)
      }).catch(reject)
      */
      resolve(app);
    }, reject)
  })
}
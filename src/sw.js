// pwa プラグインが自動で挿入するようだ
// importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

// https://developers.google.com/web/tools/workbox/guides/configure-workbox#configure_cache_names
workbox.core.setCacheNameDetails({ prefix: "vue-cli-ssr-example" });

if (workbox) {
  console.log(`ワークボックス準備完了 🎉🎉🎉`);

  // vue.config.jsでinjectManifestを設定している場合、
  // webpackがコンパイルしたファイルに関するprecache用の設定は、precacheManifestファイルに自動で書き込まれる。
  // そのため、ここではそれを読み込むだけで良い。
  // https://www.npmjs.com/package/@vue/cli-plugin-pwa/v/3.0.0-rc.1#configuration
  self.__precacheManifest = [].concat(self.__precacheManifest || []);
  workbox.precaching.suppressWarnings();
  workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
  
  // app shellアプローチを導入している場合、これでキャッシュさせる
  // workbox.routing.registerNavigationRoute('/index.html');

/*
  何か API call などを行う場合、ここでキャッシュ設定を行う。
  いろいろなキャッシュ戦略があるが、最強は staleWhileRevalidate だと思っている。
  https://developers.google.com/web/tools/workbox/modules/workbox-strategies

  workbox.routing.registerRoute(
    new RegExp('/api/.*'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'api',
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        })
      ]
    })
  );
*/

} else {
  console.log(`WorkBoxのロードに失敗😬😬😬`);
}
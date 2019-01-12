const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');

// これで、サーバー用かクライアント用かを判断する。
// このbooleanを二項演算子に突っ込むことで、1つの設定ファイルで
// webpack.client.js と webpack.server.js の2つを書くことを実現
const isServer = process.env.WEBPACK_TARGET === 'node';
// const isDev = process.env.MODE === 'dev';

// ????
const createApiFile = isServer ? './create-api-server.js' : './create-api-client.js';

const target = isServer ? 'server' : 'client';

module.exports = {
  configureWebpack: () => ({
    // entry を target により分けることで、ビルドを分ける。
    entry: `./src/entry-${target}`,
    // これにより、webpack は server の場合に Node に適した方法で動的なインポートを処理でき、
    // Vue コンポーネントをコンパイルするときにサーバー指向のコードを出力するよう
    // `vue-loader`に指示する
    // https://vue-loader-v14.vuejs.org/ja/options.html#optimizessr
    target: isServer ? 'node' : 'web',
    // https://webpack.js.org/configuration/node/
    node: isServer ? undefined : false,
    plugins: [
      // VueSSRServerPlugin は サーバービルドの出力全体を
      // 1つの JSON ファイルに変換するプラグイン。
      // デフォルトのファイル名は `vue-ssr-server-bundle.json`
      // VueSSRClientPlugin は、出力ディレクトリに
      // `vue-ssr-client-manifest.json` を生成する
      isServer
        ? new VueSSRServerPlugin()
        : new VueSSRClientPlugin(),
      // vue cliでビルドする際に、SSRでビルドする時と被るものを削除するために入れる
      new HtmlWebpackExcludeAssetsPlugin()
    ],
    // アプリケーションの依存関係を外部化する
    // これにより、サーバーのビルドが大幅に高速化され、より小さなバンドルファイルが生成される
    externals: isServer ? nodeExternals({
      // webpack で処理する必要がある依存関係を外部化しない
      whitelist: /\.css$/
    }) : undefined,
    output: {
      // server の場合に Node スタイルのエクスポートを使用するようにサーバーバンドルに指示する
      libraryTarget: isServer
        ? 'commonjs2'
        : undefined
    },
    optimization: {
      splitChunks: undefined
    },
    resolve: {
      alias: {
        'create-api': createApiFile
      }
    }
  }),
  chainWebpack: config => {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugin('html').tap(options => {
      if (process.env.NODE_ENV === 'production') {
        options[0].minify.removeComments = false;
      }
      options[0].excludeAssets = [/.js/, /.css/];
      return options;
    })
  },
  // publicフォルダーをdistにコピーするwebpackの設定の ignore オプションを上書きし、LP.html をコピーしないようにしている。
  // https://github.com/vuejs/vue-cli/issues/2231
  // chainWebpack: config => {
  //   config.plugin('copy').tap(([options]) => {
  //     options[0].ignore.push('LP.html');
  //     return [options];
  //   });
  // },
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/sw.js',
      // webpackで生成したものに対する precache の設定は勝手に行ってくれる。
      // webpackが知らないものをキャッシュしたい場合、別途 globPatterns などで設定する必要がある。
      // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#cache_additional_non-webpack_assets
    },
    // workboxの設定だけでなく、nameやthemeColorなどの設定もできる。
    // https://www.npmjs.com/package/@vue/cli-plugin-pwa/v/3.0.0-rc.1#configuration
  },
}
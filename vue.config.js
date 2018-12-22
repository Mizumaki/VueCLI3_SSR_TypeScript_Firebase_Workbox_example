const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')

// これで、サーバー用かクライアント用かを判断する。
// このbooleanを二項演算子に突っ込むことで、1つの設定ファイルで
// webpack.client.js と webpack.server.js の2つを書くことを実現
const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'

const createApiFile = TARGET_NODE
  ? './create-api-server.js'
  : './create-api-client.js'

const target = TARGET_NODE
  ? 'server'
  : 'client'

module.exports = {
  configureWebpack: () => ({
    entry: `./src/entry-${target}`,
    // これにより、webpack は server の場合に Node に適した方法で動的なインポートを処理でき、
    // Vue コンポーネントをコンパイルするときにサーバー指向のコードを出力するよう
    // `vue-loader`に指示する
    target: TARGET_NODE ? 'node' : 'web',
    // https://webpack.js.org/configuration/node/
    node: TARGET_NODE ? undefined : false,
    plugins: [
      // VueSSRServerPlugin は サーバービルドの出力全体を
      // 1つの JSON ファイルに変換するプラグイン。
      // デフォルトのファイル名は `vue-ssr-server-bundle.json`
      // VueSSRClientPlugin は、出力ディレクトリに
      // `vue-ssr-client-manifest.json` を生成する
      TARGET_NODE
        ? new VueSSRServerPlugin()
        : new VueSSRClientPlugin()
    ],
    // アプリケーションの依存関係を外部化する
    // これにより、サーバーのビルドが大幅に高速化され、より小さなバンドルファイルが生成される
    externals: TARGET_NODE ? nodeExternals({
      // webpack で処理する必要がある依存関係を外部化しない
      whitelist: /\.css$/
    }) : undefined,
    output: {
      // server の場合に Node スタイルのエクスポートを使用するようにサーバーバンドルに指示する
      libraryTarget: TARGET_NODE
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
}
const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');
const template = require('fs').readFileSync('./src/index.template.html', 'utf-8');
const serverBundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // https://ssr.vuejs.org/ja/api/#runinnewcontext
  template,
  clientManifest
})

const app = express();

app.get('*', (req, res) => {
  res.setHeader("Content-Type", "text/html");

  const context = { url: req.url }

  // バンドルを実行することで自動作成されるため、ここでアプリケーションを渡す必要はありません
  // 今、私たちのサーバーはVueアプリから切り離されています！
  renderer.renderToString(context, (err, html) => {
    if (err) {
      throw err;
    }
    console.log('in Express');
    res.end(html)
  })
})

module.exports = app;
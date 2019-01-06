const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression')
const { createBundleRenderer } = require('vue-server-renderer');
var proxy = require('http-proxy-middleware');
const serverBundle = require('./functions/dist/app/vue-ssr-server-bundle.json');
const clientManifest = require('./functions/dist/app/vue-ssr-client-manifest.json');

const devServerBaseURL = process.env.DEV_SERVER_BASE_URL || 'http://localhost';
const devServerPort = process.env.DEV_SERVER_PORT || 8081;

const resolve = file => path.resolve(__dirname, file);
const templatePath = resolve('./functions/dist/index.template.html');

// TODO: devの場合における別ページへの遷移が上手くいかない。
const isProd = process.env.NODE_ENV === 'production';

const app = express();

const createRenderer = (bundle, options) => {
  console.log("");
  console.log("in createRenderer");
  console.log("");
  return createBundleRenderer(bundle, Object.assign(options, {
    //
    // other component caching is here
    //
    runInNewContext: false, // https://ssr.vuejs.org/ja/api/#runinnewcontext
  }))
}

const template = fs.readFileSync(templatePath, 'utf-8');
const renderer = createRenderer(serverBundle, { template, clientManifest });

if (!isProd) {
  app.use('/js/main*', proxy({
    target: `${devServerBaseURL}:${devServerPort}`,
    changeOrigin: true,
    pathRewrite: function (path) {
      return path.includes('main')
        ? '/main.js'
        : path
    },
    prependPath: false
  }));

  app.use('/js/about*', proxy({
    target: `${devServerBaseURL}:${devServerPort}`,
    changeOrigin: true,
    pathRewrite: function (path) {
      return path.includes('about')
        ? '/about.js'
        : path
    },
    prependPath: false
  }));

  app.use('/*hot-update*', proxy({
    target: `${devServerBaseURL}:${devServerPort}`,
    changeOrigin: true,
  }));


  app.use('/sockjs-node', proxy({
    target: `${devServerBaseURL}:${devServerPort}`,
    changeOrigin: true,
    ws: true
  }));
}

/*
const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})
*/

const serve = (filePath) => express.static(resolve(filePath));

app.use(compression({ threshold: 0 }));
app.use('/favicon.ico', serve('./functions/dist/app/favicon.ico'));
app.use('/dist', serve('./functions/dist/app/'));
app.use('/img', serve('./functions/dist/app/img'));
app.use('/public', serve('./public'));
// app.use('/service-worker.js', serve('./functions/dist/app/service-worker.js'));
app.use('/js', serve('./functions/dist/app/js'));
app.use('/css', serve('./functions/dist/app/css'));
app.get('/precache-manifest*', (req, res) => {
  res.send(`./functions/dist/app/${req.url}`);
});
app.use('/manifest.json', serve('./functions/dist/app/manifest.json'));


const render = (req, res) => {
  console.log("");
  console.log("in render");
  console.log("");
  const s = Date.now();

  res.setHeader("Content-Type", "text/html");

  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if (err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).send('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }

  const context = { url: req.url }

  renderer.renderToString(context, (err, html) => {
    console.log("");
    console.log("in renderer.renderToString");
    console.log(context.url);
    console.log(html);
    if (err) {
      return handleError(err);
    }
    res.end(html);

    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`);
    }
  })
}

app.get('*', render);

module.exports = app;
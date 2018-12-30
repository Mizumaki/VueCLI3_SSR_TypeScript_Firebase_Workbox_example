const fs = require('fs');
const express = require('express');
const compression = require('compression')
const { createBundleRenderer } = require('vue-server-renderer');
const serverBundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');

const resolve = file => path.resolve(__dirname, file);
const templatePath = resolve('./src/index.template.html');

const isProd = process.env.NODE_ENV === 'production'

const app = express();

const createRenderer = (bundle, options) => {
  return createBundleRenderer(bundle, Object.assign(options, {
    //
    // other component caching is here
    //
    runInNewContext: false, // https://ssr.vuejs.org/ja/api/#runinnewcontext
  }))
}

let readyPromise;
let renderer;

if (isProd) {
  const template = fs.readFileSync(templatePath, 'utf-8');
  renderer = createRenderer(serverBundle, { template, clientManifest })
} else {
  readyPromise = require('./scripts/dev-server')(
    app,
    template,
    (bundle, options) => {
      renderer = createRenderer(bundle, options);
    }
  )
}

/*
const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})
*/

app.use(compression({ threshold: 0 }));
app.use('/dist', express.static(resolve('./dist')));
// app.use('/public', express.static(resolve('./public')));

const render = (req, res) => {
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
    if (err) {
      return handleError(err);
    }
    res.end(html);

    if (!isProd) {
      console.log(`whole request: ${Date.now() - s}ms`);
    }
  })
}

app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res));
})

module.exports = app;
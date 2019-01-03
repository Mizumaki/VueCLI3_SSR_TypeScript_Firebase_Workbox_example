import * as fs from 'fs';
import express from 'express';
import compression from 'compression';
import path from 'path';
import { createBundleRenderer } from 'vue-server-renderer';
const serverBundle = require('./app/vue-ssr-server-bundle.json');
const clientManifest = require('./app/vue-ssr-client-manifest.json');

const resolve = file => path.resolve(__dirname, file);
const templatePath = resolve('./index.template.html');

const app = express();

const createRenderer = (bundle, options) => {
  return createBundleRenderer(bundle, Object.assign(options, {
    //
    // other component caching is here
    //
    runInNewContext: false, // https://ssr.vuejs.org/ja/api/#runinnewcontext
  }))
}

let renderer;

const template = fs.readFileSync(templatePath, 'utf-8');
renderer = createRenderer(serverBundle, { template, clientManifest })

/*
const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})
*/

app.use(compression({ threshold: 0 }));
app.use('/dist', express.static(resolve('./dist')));
// app.use('/public', express.static(resolve('./public')));

const render = (req, res) => {

  res.setHeader("Content-Type", "text/html");

  const handleError = (err) => {
    if (err.url) {
      return res.redirect(err.url);
    } else if (err.code === 404) {
      return res.status(404).send('404 | Page Not Found');
    } else {
      // Render Error Page or Redirect
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
      return res.status(500).send('500 | Internal Server Error');
    }
  }

  const context = { url: req.url }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err);
    }
    res.end(html);
  })
}

app.get('*', render);

export { app };
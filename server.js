const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression')
const { createBundleRenderer } = require('vue-server-renderer');

// const proxy = require('http-proxy-middleware');
// const devServerBaseURL = process.env.DEV_SERVER_BASE_URL || 'http://localhost'
// const devServerPort = process.env.DEV_SERVER_PORT || 8081
// const devServerUrl = devServerBaseURL + ":" + devServerPort;
// const isProd = process.env.NODE_ENV === 'production';

const app = express();
const resolve = file => path.resolve(__dirname, file);
const serve = (filePath) => express.static(resolve(filePath));

let templatePath;
let clientManifest;
let serverBundle;
let renderer;
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

/*
if (isProd) {
*/
  templatePath = resolve('./functions/dist/app/index.html');

  serverBundle = require('./functions/dist/app/vue-ssr-server-bundle.json');
  clientManifest = require('./functions/dist/app/vue-ssr-client-manifest.json');
  const template = fs.readFileSync(templatePath, 'utf-8');

  renderer = createRenderer(serverBundle, { template, clientManifest });

  /*
  const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
  })
  */

  app.use(compression({ threshold: 0 }));
  app.use('/favicon.ico', serve('./functions/dist/app/favicon.ico'));
  app.use('/img', serve('./functions/dist/app/img'));
  app.use('/js', serve('./functions/dist/app/js'));
  app.use('/css', serve('./functions/dist/app/css'));
  app.get('/precache-manifest*', (req, res) => {
    res.send(`./functions/dist/app/${req.url}`);
  });
  app.use('/manifest.json', serve('./functions/dist/app/manifest.json'));
  app.use('/sw.js', serve('./functions/dist/app/sw.js'));

  /*
} else {
  templatePath = resolve('./public/index.html');

  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./dev/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )

  app.use('/favicon.ico', serve('./public/favicon.ico'));
  app.use('/dist', serve('./dist', true))
  app.use('/public', serve('./public', true))
  app.use('/manifest.json', serve('./public/manifest.json', true))
}

*/

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
    console.log("");
    if (err) {
      return handleError(err);
    }
    res.end(html);

    console.log(`whole request: ${Date.now() - s}ms`);
  })
}

app.get('*', render);

module.exports = app;
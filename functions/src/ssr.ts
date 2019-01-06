import * as fs from 'fs';
import express from 'express';
import compression from 'compression';
import path from 'path';
import { createBundleRenderer } from 'vue-server-renderer';
const serverBundle = require('./app/vue-ssr-server-bundle.json');
const clientManifest = require('./app/vue-ssr-client-manifest.json');

// path.resolveは大事
// https://koukitips.net/post1825/
const resolve = file => path.resolve(__dirname, file);
const templatePath = resolve('./index.template.html');

const app = express();

const createRenderer = (bundle, options) => {
  console.log("");
  console.log("In createRenderer");
  console.log("");
  return createBundleRenderer(bundle, Object.assign(options, {
    //
    // other component caching is here
    //
    runInNewContext: false, // https://ssr.vuejs.org/ja/api/#runinnewcontext
  }))
}

const template = fs.readFileSync(templatePath, 'utf-8');
const renderer = createRenderer(serverBundle, { template, clientManifest })

/*
キャッシュを含めることも可能
const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache ? 1000 * 60 * 60 * 24 * 30 : 0
})
*/

const serve = (filePath) => express.static(resolve(filePath));

app.use(compression({ threshold: 0 }));
app.use('/favicon.ico', serve('./app/favicon.ico'));
app.use('/service-worker.js', serve('./app/service-worker.js'));
app.use('/js', serve('./app/js'));
app.use('/css', serve('./app/css'));
app.use('/img', serve('./app/img'));
app.get('/precache-manifest*', (req, res) => {
  res.send(`./app/${req.url}`);
})

/*
microcacheを利用する場合
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))
*/

const render = (req, res) => {
  console.log("");
  console.log('in render');
  console.log("");
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
    console.log("new");
    console.log("in renderer.renderToString");
    console.log(`url is ${context.url}`);
    console.log("");
    if (err) {
      return handleError(err);
    }
    res.end(html);
  })
}

app.get('*', render);

export { app };
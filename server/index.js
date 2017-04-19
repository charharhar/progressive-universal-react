import { readFile as fsReadFile } from 'fs';
import { resolve as pathResolve } from 'path';
import express from 'express';
import compression from 'compression';
import appRootDir from 'app-root-dir';
import config from '../tools/config';

import App from '../shared/App';
import renderApp from './middleware/renderApp';

const ngrok = process.env.ENABLE_TUNNEL === 'true' ? require('ngrok') : false;
const isProd = process.env.NODE_ENV === 'production';
const { serverPort, host, clientOutputPath, webPath, publicPath } = config;

const app = express();

app.use(compression());

if (isProd) {
  app.get('/sw.js', (req, res, next) =>
    res.sendFile(
      pathResolve(
        appRootDir.get(),
        clientOutputPath,
        './sw.js'
      )
    )
  );

  app.get(`${webPath}/index.html`, (req, res, next) =>
    fsReadFile(
      pathResolve(
        appRootDir.get(),
        clientOutputPath,
        './index.html'
      ),
      'utf-8',
      (err, data) => {
        if (err) {
          res.status(500).send('Error returning offline page');
          return;
        }

        res.send(data);
      }
    )
  );
}

// Serve ./build/client from /client
app.use(webPath, express.static(pathResolve(appRootDir.get(), clientOutputPath)));
// Serve ./public from /
app.use('/', express.static(pathResolve(appRootDir.get(), './public')));
app.use(renderApp);

const server = app.listen(serverPort, host, (err) => {
  if (err) {
    return console.error(err);
  }

  if (ngrok) {
    ngrok.connect(serverPort, (innerErr, url) => {
      if (innerErr) {
        return console.error(err);
      }
      console.log(`Server tunnel enabled at ${url}`)
    })
  } else {
    console.log(`Server listening at http://${host}:${serverPort}`)
  }
})

export default server;

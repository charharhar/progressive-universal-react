import path from 'path';
import express from 'express';
import compression from 'compression';
import appRootDir from 'app-root-dir';
import config from '../tools/config';

import App from '../shared/App';
import renderApp from './middleware/renderApp';

const ngrok = process.env.ENABLE_TUNNEL === 'true' ? require('ngrok') : false;

const app = express();
const { serverPort, host, buildPathName } = config;

app.use(compression());
app.use('/static', express.static(buildPathName));
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

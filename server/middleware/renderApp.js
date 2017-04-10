
import fs from 'fs';
import path from 'path';
import React from 'react';
import appRootDir from 'app-root-dir';
import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';
import config from '../../tools/config';

import App from '../../shared/App';

const IS_PROD = process.env.NODE_ENV === 'production';

const renderApp = (req, res) => {
  const context = {}
  const appHtml = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  if (context.url) {
    return res.redirect(302, context.url);
  }

  return res
    .status(context.status || 200)
    .send(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <title>Universal React Starter</title>
        </head>
        <body>
          <div id="app">${appHtml}</div>
          <script src="/static/client/vendorDll.js"></script>
          <script src="http://${config.host}:${config.clientPort}/client/main.js"></script>
        </body>
      </html>
    `);
};

export default renderApp;

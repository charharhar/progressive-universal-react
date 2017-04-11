
import fs from 'fs';
import path from 'path';
import React from 'react';
import appRootDir from 'app-root-dir';
import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';
import config from '../../tools/config';

import App from '../../shared/App';

const isProd = process.env.NODE_ENV === 'production';
const { host, clientPort, staticPath, clientOutputPath } = config;

const assetsFilePath = path.resolve(
  appRootDir.get(),
  clientOutputPath,
  './assets.json',
);

const readAssetsJSONFile = () =>
  JSON.parse(fs.readFileSync(assetsFilePath, 'utf8'));

const renderScript = filename =>
  `<script src="${isProd ? `${staticPath}/client/` : ''}${filename}"></script>`;

const renderCSS = filename =>
  `<link rel="stylesheet" type="text/css" href="${staticPath}/client/${filename}" />`

const renderApp = (req, res) => {
  const context = {}
  const assetsMap = readAssetsJSONFile();
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
          ${isProd ? renderCSS(assetsMap.index.css) : ''}
        </head>
        <body>
          <div id="app">${appHtml}</div>
          ${isProd ? '' : `<script src="${staticPath}/client/vendorDll.js"></script>`}
          ${renderScript(assetsMap.index.js)}
        </body>
      </html>
    `);
};

export default renderApp;

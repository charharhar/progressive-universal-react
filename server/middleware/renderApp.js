
import fs from 'fs';
import path from 'path';
import React from 'react';
import appRootDir from 'app-root-dir';
import { StaticRouter } from 'react-router';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import config from '../../tools/config';

import App from '../../shared/App';
import Html from '../../shared/Html';

const isProd = process.env.NODE_ENV === 'production';
const {
  host,
  clientPort,
  staticPath,
  clientOutputPath,
  title,
  description,
} = config;

const assetsFilePath = path.resolve(
  appRootDir.get(),
  clientOutputPath,
  './assets.json',
);

const readAssetsJSONFile = () =>
  JSON.parse(fs.readFileSync(assetsFilePath, 'utf8'));

const renderScriptPath = filename =>
  `${isProd ? staticPath : ''}${filename}`;

const renderCSSPath = filename =>
  isProd ? `${staticPath}${filename}` : false;

const renderDllPath = () =>
  !isProd ? `${staticPath}/client/vendorDll.js` : false;

const renderApp = (req, res) => {
  const context = {}
  const assetsMap = readAssetsJSONFile();
  const appString = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  const htmlMarkup = renderToStaticMarkup(
    <Html
      title={title}
      description={description}
      styles={renderCSSPath(assetsMap.index.css)}
      scripts={renderScriptPath(assetsMap.index.js)}
      vendorDll={renderDllPath()}
    >
      {appString}
    </Html>
  );

  if (context.url) {
    return res.redirect(302, context.url);
  }

  return res
    .status(context.status || 200)
    .send(`<!doctype html>${htmlMarkup}`);
};

export default renderApp;


import { readFileSync as fsReadFileSync } from 'fs';
import { resolve as pathResolve } from 'path';
import React from 'react';
import serialize from 'serialize-javascript';
import appRootDir from 'app-root-dir';
import { StaticRouter } from 'react-router';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import config from '../../tools/config';

import App from '../../shared/App';
import Html from '../../shared/Html';

const isProd = process.env.NODE_ENV === 'production';
const {
  webPath,
  clientOutputPath,
  title,
  description,
  serviceWorker,
  jsonLd,
} = config;

const assetsFilePath = pathResolve(
  appRootDir.get(),
  clientOutputPath,
  './assets.json',
);

// Helper functions to generate path names

const readAssetsJSONFile = () => JSON.parse(fsReadFileSync(assetsFilePath, 'utf8'));

const renderScriptPath = (filename) => filename;

const renderCSSPath = (filename) => isProd ? filename : false;

const renderDllPath = () => !isProd ? `${webPath}vendorDll.js` : false

const renderJSONLD = (children) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{__html: children}}
  />
)

const renderInlineScript = ({ render, key, children }) => ( render ?
  <script
    type='text/javascript'
    dangerouslySetInnerHTML={{
      __html: `window.${key}=${children}`
    }}
  /> : false
)

const applicationJSONLd = jsonLd;

const clientConfig = {
  render: isProd,
  key: '__CLIENT_CONFIG__',
  children: serialize({
    "serviceWorker":{"enabled":true}
  })
}

//
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
      jsonLd={renderJSONLD(applicationJSONLd)}
      inlineScript={renderInlineScript(clientConfig)}
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

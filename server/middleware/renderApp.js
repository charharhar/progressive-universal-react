
import { readFileSync as fsReadFileSync } from 'fs';
import { resolve as pathResolve } from 'path';
import React, { Children } from 'react';
import appRootDir from 'app-root-dir';
import { StaticRouter } from 'react-router';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import config from '../../tools/config';
import { ifElse, removeEmpty } from '../../tools/utils';

import App from '../../shared/App';
import Html from '../../shared/Html';

const isProd = process.env.NODE_ENV === 'production';
const ifDev = ifElse(!isProd);

const {
  webPath,
  clientOutputPath,
  title,
  description,
  dllConfig,
  jsonLd,
  clientConfig,
} = config;

const assetsFilePath = pathResolve(
  appRootDir.get(),
  clientOutputPath,
  './assets.json',
);

// Helper functions to generate path names
const KeyedComponent = ({ children }) => Children.only(children);

const readAssetsJSONFile = () => JSON.parse(fsReadFileSync(assetsFilePath, 'utf8'));

const stylePath = (path) => (
  isProd
    ? <link rel="stylesheet" type="text/css" href={path} />
    : false
)

const scriptPath = (path) => (
  <script
    type="text/javascript"
    src={path}
  />
)

const inlineScript = ({ type = 'text/javascript', children }) => (
  <script
    type={type}
    dangerouslySetInnerHTML={{__html: children}}
  />
)

const renderApp = (req, res) => {
  const context = {}
  const assetsMap = readAssetsJSONFile();

  const appString = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  const scriptElements = removeEmpty([
    scriptPath('https://cdn.polyfill.io/v2/polyfill.min.js'),
    ifDev(scriptPath(`${webPath}${dllConfig.name}.js`)),
    scriptPath(assetsMap.index.js),
    inlineScript({ type: 'application/ld+json', children: jsonLd }),
    inlineScript({ children: clientConfig })
  ]);

  const htmlMarkup = renderToStaticMarkup(
    <Html
      title={title}
      description={description}
      styleElements={stylePath(assetsMap.index.css)}
      scriptElements={scriptElements.map((script, key) =>
        <KeyedComponent key={key}>{script}</KeyedComponent>
      )}
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

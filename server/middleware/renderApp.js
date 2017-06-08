
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
const ifProd = ifElse(isProd);

const {
  title,
  description,
  dllConfig,
  clientConfig,
  webPath,
  jsonLd,
  cdnAssets,
  clientOutputPath,
} = config;

const assetsFilePath = pathResolve(
  appRootDir.get(),
  clientOutputPath,
  './assets.json',
);

// Helper functions to generate path names
const KeyedComponent = ({ children }) => Children.only(children);

const stylePath = (path) =>
  <link href={path} type="text/css" rel="stylesheet" />

const scriptPath = (path) =>
  <script src={path} type="text/javascript" />

const inlineScript = ({ type = 'text/javascript', children }) =>
  <script type={type} dangerouslySetInnerHTML={{__html: children}} />


// RenderApp Main function
const renderApp = (req, res) => {
  const context = {}
  const assetsMap = JSON.parse(fsReadFileSync(assetsFilePath, 'utf8'));

  const appString = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  const styleElements = cdnAssets.css.map(ref => stylePath(ref))
    .concat(removeEmpty([
      ifProd(stylePath(assetsMap.index.css)),
    ]))

  const scriptElements = cdnAssets.js.map(ref => scriptPath(ref))
    .concat(removeEmpty([
      ifDev(scriptPath(`${webPath}${dllConfig.name}.js`)),
      scriptPath(assetsMap.index.js),
      inlineScript({ type: 'application/ld+json', children: jsonLd }),
      inlineScript({ children: clientConfig })
    ]))

  const htmlMarkup = renderToStaticMarkup(
    <Html
      title={title}
      description={description}
      styleElements={styleElements.map((style, key) =>
        <KeyedComponent key={key}>{style}</KeyedComponent>
      )}
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

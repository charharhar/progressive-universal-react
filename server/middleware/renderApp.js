
import fs from 'fs';
import path from 'path';
import React from 'react';
import appRootDir from 'app-root-dir';
import { renderToString } from 'react-dom/server';

import App from '../../shared/App';

const IS_PROD = process.env.NODE_ENV === 'production';

const renderApp = () => {
  const appHtml = renderToString(<App />);

  return (
    `<!doctype html>
    <html>
      <head>
        <title>Universal React Starter</title>
      </head>
      <body>
        <div id="app">${appHtml}</div>
        <script src="http://localhost:7000/client/vendor.js"></script>
        <script src="http://localhost:7000/client/main.js"></script>
      </body>
    </html>
    `
  );
};

export default renderApp;

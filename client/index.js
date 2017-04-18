import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import App from '../shared/App';

const isProd = process.env.NODE_ENV === 'production';
const rootEl = document.querySelector('#app');

const ReactHotLoader =
  isProd
  ? ({ children }) => React.Children.only(children)
  : require('react-hot-loader').AppContainer;

const renderApp = AppComponent =>
  <ReactHotLoader>
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  </ReactHotLoader>

render(renderApp(App), rootEl);

if (!isProd && module.hot) {
  module.hot.accept('../shared/App', () => {
    const nextApp = require('../shared/App').default;
    render(renderApp(nextApp), rootEl);
  });
}

if (isProd) {
  OfflinePluginRuntime.install({
      onUpdating: () => undefined,
      onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
      onUpdated: () => window.location.reload(),
      onUpdateFailed: () => undefined,
    });
}

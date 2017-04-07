import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from '../shared/App';

const IS_PROD = process.env.NODE_ENV === 'production';
const rootEl = document.querySelector('#app');

const ReactHotLoader =
  IS_PROD
  ? ({ children }) => React.Children.only(children)
  : require('react-hot-loader').AppContainer;

const renderApp = AppComponent =>
  <ReactHotLoader>
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>
  </ReactHotLoader>

render(renderApp(App), rootEl);

if (!IS_PROD && module.hot) {
  // flow-disable-next-line
  module.hot.accept('../shared/App', () => {
    const nextApp = require('../shared/App').default;
    render(renderApp(nextApp), rootEl);
  });
}

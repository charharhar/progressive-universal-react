
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Html from '../../shared/Html';
import config from '../config';

module.exports = function offlinePageTemplate() {
  const html = renderToStaticMarkup(
    <Html
      title={config.title}
      description={config.description}
    />,
  );
  return `<!DOCTYPE html>${html}`;
};

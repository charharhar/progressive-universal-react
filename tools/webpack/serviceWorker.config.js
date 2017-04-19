import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OfflinePlugin from 'offline-plugin';

import config from '../config';

const { offlinePageName, webPath } = config;

export default function serviceWorker(webpackConfig) {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: offlinePageName,
      template: `babel-loader!${pathResolve(__dirname, '../helpers/offlinePageTemplate.js')}`,
      production: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeNilAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    })
  );

  webpackConfig.plugins.push(
    new OfflinePlugin({
      publicPath: '/client/',
      relativePaths: false,
      ServiceWorker: {
        output: 'sw.js',
        events: true,
        publicPath: '/sw.js',
        navigateFallbackURL: `${webPath}/${offlinePageName}`,
      },
      AppCache: false,
    })
  );

  return webpackConfig;
}

import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OfflinePlugin from 'offline-plugin';

export default function serviceWorker(webpackConfig) {
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: 'index.html',
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
      caches: {
        main: ['index.html', ':rest:'],
      },
      ServiceWorker: {
        output: 'sw.js',
        events: true,
        publicPath: '/sw.js',
        navigateFallbackURL: '/client/index.html',
      },
      AppCache: false,
    })
  );

  return webpackConfig;
}

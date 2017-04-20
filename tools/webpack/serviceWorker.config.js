import { sync as globSync } from 'glob';
import { resolve as pathResolve, relative as pathRelative } from 'path';
import appRootDir from 'app-root-dir';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OfflinePlugin from 'offline-plugin';

import config from '../config';

const { offlinePageName, webPath, publicPath } = config;

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

  const publicAssets = ['./**/*'].reduce((acc, cur) => {
    const publicAssetPathGlob = pathResolve(
      appRootDir.get(), publicPath, cur,
    );

    const publicFileWebPaths = acc.concat(
      globSync(publicAssetPathGlob, { nodir: true })
      .map(publicFile => pathRelative(
        pathResolve(appRootDir.get(), publicPath),
        publicFile,
      ))
      .map(relativePath => `/${relativePath}`),
    );

    return publicFileWebPaths;
  }, [])

  webpackConfig.plugins.push(
    new OfflinePlugin({
      publicPath: webPath,
      relativePaths: false,
      ServiceWorker: {
        output: 'sw.js',
        events: true,
        publicPath: '/sw.js',
        navigateFallbackURL: `${webPath}${offlinePageName}`,
      },
      AppCache: false,
      externals: [
        'https://cdn.polyfill.io/v2/polyfill.min.js',
        ...publicAssets,
      ],
    })
  );

  return webpackConfig;
}

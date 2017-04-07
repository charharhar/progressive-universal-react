
import webpack from 'webpack';
import fs from 'fs';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import clientConfig from '../webpack/webpack.client';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { log } from '../utils'

clientConfig.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8888,

    reportFilename: 'report.html',
    openAnalyzer: true,
    // true => Webpack Stats JSON file will be in bundles output directory
    generateStatsFile: true,
    statsFilename: 'stats.json',

    statsOptions: null,
    logLevel: 'info',
  })
)

const compiler = webpack(clientConfig);

compiler.run((err, stats) => {
  if (err) {
    console.error(err);
  } else {
    log({
      title: 'Analyzer',
      message: 'Running Webpack Bundle Analyzer',
    })
  }
})

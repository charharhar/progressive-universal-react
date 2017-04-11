
import webpack from 'webpack';
import configFactory from '../webpack/webpack.config';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { log } from '../utils'
import config from '../config';

const { configProduction, targetClient, targetServer } = config;
const targetBundle = process.argv.includes('--client') ? targetClient : targetServer;
const configObject = Object.assign({}, configProduction, targetBundle);
const webpackConfig = configFactory(configObject);

webpackConfig.plugins.push(
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

const compiler = webpack(webpackConfig);

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

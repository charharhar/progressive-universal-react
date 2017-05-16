
import webpack from 'webpack';
import configFactory from '../webpack/webpack.config';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { log } from '../utils'

const targetBundle = process.argv.includes('--client') ? 'client' : 'server';
const configObject = { target: targetBundle, mode: 'production' };

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
    console.log(stats.toString({ colors: true }));

    log({
      title: 'Analyzer',
      message: 'Running Webpack Bundle Analyzer',
    })
  }
})

import path from 'path';
import chalk from 'chalk';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';
import nodeExternals from 'webpack-node-externals';
import config from '../config';
import { ifElse, removeEmpty } from '../utils';

export default function configFactory(options) {
  const { target, mode } = options;
  console.log(chalk.blue(`==> Creating webpack config for ${target} in ${mode} mode.`));

  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isClient = target === 'client';
  const isNode = target === 'server';

  const ifDev = ifElse(isDev);
  const ifProd = ifElse(isProd);
  const ifNode = ifElse(isNode);
  const ifClient = ifElse(isClient);
  const ifDevClient = ifElse(isDev && isClient);
  const ifProdClient = ifElse(isProd && isClient);

  const webpackConfig = {
    target: isClient ? 'web' : 'node',

    node: {
      __dirname: true,
      __filename: true,
    },

    externals: removeEmpty([
      ifNode(() => nodeExternals())
    ]),

    devtool: isProd ? 'hidden-source-map' : 'source-map',

    entry: {
      main: removeEmpty([
        ifDevClient('react-hot-loader/patch'),
        ifDevClient(`webpack-hot-middleware/client?reload=true&path=http://${config.host}:${config.clientPort}/__webpack_hmr`),
        ifClient(
          path.resolve(appRootDir.get(), './client/index'),
          path.resolve(appRootDir.get(), './server/index')
        ),
      ]),
    },

    output: {
      path: ifClient(
        path.resolve(appRootDir.get(), config.clientOutputPath),
        path.resolve(appRootDir.get(), config.serverOutputPath)
      ),
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: ifDev(`http://${config.host}:${config.clientPort}/client`),
      libraryTarget: ifNode('commonjs2', 'var'),
    },

    resolve: {
      extensions: ['.js'],
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: '/node_modules/',
          use: 'babel-loader',
        },
        {
          test: /\.json$/,
          use: 'json-loader',
        },
        {
          test: /\.css$/,
          use: removeEmpty([
            ifNode({
              loader: 'css-loader/locals',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            }),
            ifDevClient({ loader: 'style-loader' }),
            ifDevClient({
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            }),
          ])
        },
      ]
    },

    plugins: removeEmpty([
      // Define some process variables
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      // Enable hot module replacement plugin
      ifDevClient(() => new webpack.HotModuleReplacementPlugin()),
      // Prints more readable module names in the browser console on HMR updates
      ifDevClient(() => new webpack.NamedModulesPlugin()),
      // No errors during development to prevent crashing
      ifDev(() => new webpack.NoEmitOnErrorsPlugin()),
      ifDevClient(() => new webpack.DllReferencePlugin({
        manifest: require(
          path.resolve(
            appRootDir.get(),
            config.clientOutputPath,
            './vendorDll.json',
          )
        ),
      })),
      // Minify JS plugin
      ifProdClient(() => new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      })),
    ]),
  }

  return webpackConfig;
}

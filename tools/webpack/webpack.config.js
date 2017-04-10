import path from 'path';
import chalk from 'chalk';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';
import nodeExternals from 'webpack-node-externals';
import AssetsPlugin from 'assets-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

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
      index: removeEmpty([
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
      filename: ifProdClient('[name]-[chunkhash].js', '[name].js'),
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: ifDev(`http://${config.host}:${config.clientPort}/client/`),
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
          loader: 'babel-loader',
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        {
          test: /\.css$/,
          rules: removeEmpty([
            ifNode({
              loader: 'css-loader/locals',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            }),
            ifProdClient({
              loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader'],
              })
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
      // No errors during development to prevent crashing
      ifDev(() => new webpack.NoEmitOnErrorsPlugin()),
      // [chunkhash] only change when content has change, for long term browser caching
      ifClient(() => new WebpackMd5Hash()),
      // Generates JSON file mapping all output files
      ifClient(() =>
        new AssetsPlugin({
          filename: 'assets.json',
          path: path.resolve(appRootDir.get(), config.clientOutputPath),
        }),
      ),
      // Enable hot module replacement plugin
      ifDevClient(() => new webpack.HotModuleReplacementPlugin()),
      // Prints more readable module names in the browser console on HMR updates
      ifDevClient(() => new webpack.NamedModulesPlugin()),
      // Vendor dll reference to the manifest file to improve development rebuilding speeds
      ifDevClient(() => new webpack.DllReferencePlugin({
        manifest: require(
          path.resolve(
            appRootDir.get(),
            config.clientOutputPath,
            './vendorDll.json',
          )
        ),
      })),
      // Extract CSS into CSS files for production build
      ifProdClient(() => new ExtractTextPlugin({
        filename: '[name]-[chunkhash].css',
        allChunks: true,
      })),
      // Minify JS for production build
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

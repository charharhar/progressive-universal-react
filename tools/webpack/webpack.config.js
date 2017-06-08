import { blue as chalkBlue } from 'chalk';
import webpack from 'webpack';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import nodeExternals from 'webpack-node-externals';
import AssetsPlugin from 'assets-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';

import serviceWorker from './serviceWorker.config';
import config from '../config';
import {
  ifElse,
  removeEmpty,
  generateLoader,
} from '../utils';

export default function configFactory({ target, mode }) {
  console.log(chalkBlue(`==> Creating webpack config for ${target} in ${mode} mode.`));

  const {
    host,
    bundles,
    webPath,
    clientPort,
    cssLoaderOptions,
    sassLoaderOptions,
    postCssLoaderOptions,
  } = config;

  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isNode = !isClient;

  const ifDev = ifElse(isDev);
  const ifProd = ifElse(isProd);
  const ifNode = ifElse(isNode);
  const ifClient = ifElse(isClient);
  const ifDevNode = ifElse(isDev && isNode);
  const ifDevClient = ifElse(isDev && isClient);
  const ifProdClient = ifElse(isProd && isClient);

  const bundleConfig = bundles[target];

  let webpackConfig = {
    target: isClient ? 'web' : 'node',

    node: {
      __dirname: true,
      __filename: true,
    },

    externals: removeEmpty([
      ifNode(() => nodeExternals()),
    ]),

    devtool: isProd ? 'hidden-source-map' : 'source-map',

    performance: isProd ? { hints: 'warning' } : false,

    entry: {
      index: removeEmpty([
        ifDevClient('react-hot-loader/patch'),
        ifDevClient(`webpack-hot-middleware/client?reload=true&path=http://${host}:${clientPort}/__webpack_hmr`),
        pathResolve(appRootDir.get(), bundleConfig.entryPath),
      ]),
    },

    output: {
      path: pathResolve(appRootDir.get(), bundleConfig.outputPath),
      filename: ifProdClient('[name]-[chunkhash].js', '[name].js'),
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: ifDev(`http://${host}:${clientPort}${webPath}`, webPath),
      libraryTarget: ifNode('commonjs2', 'var'),
    },

    resolve: {
      extensions: ['.js'],
      modules: ['node_modules'],
    },

    plugins: removeEmpty([
      // Define some process variables
      new webpack.EnvironmentPlugin({
        NODE_ENV: mode,
        ENABLE_TUNNEL: JSON.stringify(process.env.ENABLE_TUNNEL) || 'false',
      }),

      // No errors during development to prevent crashing
      ifDev(() => new webpack.NoEmitOnErrorsPlugin()),

      // [chunkhash] only change when content
      // has change for long term browser caching
      ifClient(() => new WebpackMd5Hash()),

      // Only include what we use,
      // instead of the entire lodash module
      ifClient(() =>
        new LodashModuleReplacementPlugin({
          collections: true,
        })
      ),

      // Generates a JSON file mapping all of the build output files
      ifClient(() =>
        new AssetsPlugin({
          filename: 'assets.json',
          path: pathResolve(appRootDir.get(), bundleConfig.outputPath),
        })
      ),

      // Enable hot module replacement plugin
      ifDevClient(() => new webpack.HotModuleReplacementPlugin()),

      // Prints more readable module names
      // in the browser console on HMR updates
      ifDevClient(() => new webpack.NamedModulesPlugin()),

      // Vendor dll reference to the manifest file
      // to improve development rebuilding speeds
      ifDevClient(() =>
        new webpack.DllReferencePlugin({
          manifest: require(
            pathResolve(
              appRootDir.get(),
              bundleConfig.outputPath,
              './vendorDll.json',
            )
          ),
        })
      ),

      // Extract CSS into CSS files only for production build
      ifProd(() =>
        new ExtractTextPlugin({
          filename: '[name]-[chunkhash].css',
          allChunks: true,
        })
      ),

      // Minify JS only for production build
      ifProdClient(() =>
        new webpack.optimize.UglifyJsPlugin({
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
        })
      ),

      // END PLUGINS
    ]),

    module: {
      rules: [
        // Javascript Loader
        {
          test: /\.js$/,
          exclude: '/node_modules/',
          use: [
            'cache-loader',
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                plugins: ['lodash'],
                presets: removeEmpty([
                  'react',
                  'stage-3',
                  ifClient(['latest', { es2015: { modules: false } }]),
                  ifNode(['env', { targets: { node: true }, modules: false }]),
                ])
              }
            }
          ],
          include: removeEmpty([
            ...bundleConfig.srcPaths.map(srcPath =>
              pathResolve(appRootDir.get(), srcPath),
            ),
          ]),
        },

        // CSS/SCSS Loader
        ifElse(isClient || isServer)(() => ({
          test: /\.css$/,
          exclude: '/node_modules/',
          rules: removeEmpty([
            ifProd({
              loader: ExtractTextPlugin.extract({
                use: [
                  generateLoader('css-loader', cssLoaderOptions(mode)),
                  generateLoader('postcss-loader', postCssLoaderOptions(mode)),
                  generateLoader('sass-loader', sassLoaderOptions(mode)),
                ],
                fallback: 'style-loader',
              })
            }),
            ifDevClient({
              use: [
                'cache-loader',
                'style-loader',
                generateLoader('css-loader', cssLoaderOptions(mode)),
                generateLoader('postcss-loader', postCssLoaderOptions(mode)),
                generateLoader('sass-loader', sassLoaderOptions(mode)),
              ],
            }),
            ifDevNode({
              loader: 'css-loader/locals',
              options: cssLoaderOptions(mode),
            }),
          ])
        })),

        // JSON Loader
        {
          test: /\.json$/,
          loader: 'json-loader',
        },

        // Special file type Loader
        {
          test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
          loader: 'file-loader',
          query: {
            name: ifDev('[path][name].[ext]?[hash:8]', '[hash:8].[ext]'),
          },
        },
      ]
    },
  };

  if (isProd && isClient) {
    webpackConfig = serviceWorker(webpackConfig);
  }

  return webpackConfig;
}

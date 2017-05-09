import { blue as chalkBlue } from 'chalk';
import webpack from 'webpack';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import HappyPack from 'happypack';
import nodeExternals from 'webpack-node-externals';
import AssetsPlugin from 'assets-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';

import serviceWorker from './serviceWorker.config';
import config from '../config';
import { ifElse, removeEmpty } from '../utils';

export default function configFactory({ target, mode }) {
  console.log(chalkBlue(`==> Creating webpack config for ${target} in ${mode} mode.`));

  const {
    host,
    bundles,
    clientPort,
    cssLoaderOptions,
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
      publicPath: ifDev(`http://${host}:${clientPort}/client/`, '/client/'),
      libraryTarget: ifNode('commonjs2', 'var'),
    },

    resolve: {
      extensions: ['.js'],
    },

    plugins: removeEmpty([
      // Define some process variables
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.ENABLE_TUNNEL': JSON.stringify(process.env.ENABLE_TUNNEL),
      }),

      // No errors during development to prevent crashing
      ifDev(() => new webpack.NoEmitOnErrorsPlugin()),

      // [chunkhash] only change when content has change, for long term browser caching
      ifClient(() => new WebpackMd5Hash()),

      // Only include what we use, instead of the entire lodash module
      ifClient(() =>
        new LodashModuleReplacementPlugin({
          collections: true,
        })
      ),

      // Generates JSON file mapping all output files
      ifClient(() =>
        new AssetsPlugin({
          filename: 'assets.json',
          path: pathResolve(appRootDir.get(), bundleConfig.outputPath),
        })
      ),

      // Enable hot module replacement plugin
      ifDevClient(() => new webpack.HotModuleReplacementPlugin()),

      // Prints more readable module names in the browser console on HMR updates
      ifDevClient(() => new webpack.NamedModulesPlugin()),

      // Vendor dll reference to the manifest file to improve development rebuilding speeds
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

      // Extract CSS into CSS files for production build
      ifProd(() =>
        new ExtractTextPlugin({
          filename: '[name]-[chunkhash].css',
          allChunks: true,
        })
      ),

      // Minify JS for production build
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

      // HappyPack Loaders implemented
      // Set up HappyPack JS loaders for both client/server bundles
      new HappyPack({
        id: 'happypack-javascript',
        verbose: false,
        threads: 4,
        loaders: [{
          path: 'babel-loader',
          query: {
            babelrc: false,
            plugins: ['lodash'],
            presets: removeEmpty([
              'react',
              'stage-3',
              ifClient(['latest', { es2015: { modules: false } }]),
              ifNode(['env', { targets: { node: true }, modules: false }]),
            ])
          }
        }]
      }),

      // Set up HappyPack CSS loaders for DevClient bundles
      // ExtractTextPlugin for Prod bundles
      ifDevClient(() =>
        new HappyPack({
          id: 'happypack-css-devclient',
          verbose: false,
          threads: 4,
          loaders: [
            'style-loader',
            {
              path: 'css-loader',
              query: cssLoaderOptions,
            },
            {
              loader: 'postcss-loader',
              query: {
                config: './tools/webpack/postcss.config.js',
              },
            },
          ],
        })
      ),

      // END PLUGINS
    ]),

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: '/node_modules/',
          loader: 'happypack/loader?id=happypack-javascript',
          include: removeEmpty([
            ...bundleConfig.srcPaths.map(srcPath =>
              pathResolve(appRootDir.get(), srcPath),
            ),
          ]),
        },
        ifElse(isClient || isServer)(() => ({
          test: /\.css$/,
          rules: removeEmpty([
            ifProd({
              loader: ExtractTextPlugin.extract({
                use: [
                  {
                    loader: 'css-loader',
                    options: cssLoaderOptions,
                  },
                  {
                    loader: 'postcss-loader',
                    options: {
                      config: './tools/webpack/postcss.config.js',
                    }
                  }
                ],
                fallback: 'style-loader',
              })
            }),
            ifDevClient({
              loaders: ['happypack/loader?id=happypack-css-devclient'],
            }),
            ifDevNode({
              loader: 'css-loader/locals',
              options: cssLoaderOptions,
            }),
          ])
        })),
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
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

import path from 'path';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';

import {
  JS_LOADER,
  JSON_LOADER,
  CSS_LOADER_OPTIONS,
} from './webpack.common';

const client = {
  target: 'web',

  entry: {
    main: [
      'react-hot-loader/patch',
      `webpack-hot-middleware/client?reload=true&path=http://localhost:7000/__webpack_hmr`,
      './client/index.js',
    ],
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
    ],
  },

  output: {
    path: path.resolve(appRootDir.get(), 'build/client'),
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `http://localhost:7000/client`,
  },

  resolve: {
    extensions: ['.js'],
  },

  module: {
    rules: [
      JS_LOADER,
      JSON_LOADER,
      {
        test: /\.css$/,
        use: {
          loader: 'css-loader',
          options: CSS_LOADER_OPTIONS,
        }
      },
    ],
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ]
};

export default client;

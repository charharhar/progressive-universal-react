import path from 'path';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';

import {
  JS_LOADER,
  JSON_LOADER,
  CSS_LOADER_OPTIONS,
} from './webpack.common.babel.js';

const client = {
  target: 'web',

  entry: {
    main: [
      './client/index.js',
    ],
    vendor: [
      'react',
      'react-dom',
    ],
  },

  output: {
    path: path.resolve(appRootDir.get(), 'build'),
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/static/',
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
  }
};

export default client;

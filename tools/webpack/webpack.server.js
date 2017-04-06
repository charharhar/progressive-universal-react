import path from 'path';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';
import nodeExternals from 'webpack-node-externals';

import {
  JS_LOADER,
  JSON_LOADER,
  CSS_LOADER_OPTIONS,
} from './webpack.common';

const server = {
  target: 'node',

  entry: {
    main: [
      './server/index.js',
    ]
  },

  output: {
    path: path.resolve(appRootDir.get(), 'build/server'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },

  node: {
    __filename: true,
    __dirname: true,
  },

  externals: [
    nodeExternals(),
  ],

  module: {
    rules: [
      JS_LOADER,
      JSON_LOADER,
      {
        test: /\.css/,
        use: {
          loader: 'css-loader/locals',
          options: CSS_LOADER_OPTIONS,
        }
      }
    ]
  },

  plugins: [],
}

export default server;

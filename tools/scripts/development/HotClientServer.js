import path from 'path';
import express from 'express';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';
import createWebpackDevMiddleware from 'webpack-dev-middleware';
import createWebpackHotMiddleware from 'webpack-hot-middleware';

import clientConfig from '../../webpack/webpack.client';

class ListenerManager {
  constructor(listener) {
    this.lastConnectionKey = 0;
    this.connectionMap = {};
    this.listener = listener;

    // Track all connections to our server so that we can close them when needed.
    this.listener.on('connection', (connection) => {
      // Increment the connection key.
      this.lastConnectionKey += 1;
      // Generate a new key to represent the connection
      const connectionKey = this.lastConnectionKey;
      // Add the connection to our map.
      this.connectionMap[connectionKey] = connection;
      // Remove the connection from our map when it closes.
      connection.on('close', () => {
        delete this.connectionMap[connectionKey];
      });
    });
  }

  killAllConnections() {
    Object.keys(this.connectionMap).forEach((connectionKey) => {
      this.connectionMap[connectionKey].destroy();
    });
  }

  dispose() {
    return new Promise((resolve) => {
      if (this.listener) {
        this.killAllConnections();

        console.log('Destroyed all existing connections.');

        this.listener.close(() => {
          console.log('Closed listener.')

          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

class HotClientServer {
  constructor() {
    const compiler = webpack(clientConfig);
    const app = express();

    this.webpackDevMiddleware = createWebpackDevMiddleware(compiler, {
      quiet: true,
      noInfo: true,
      publicPath: compiler.options.output.publicPath,
    })
    this.webpackHotMiddleware = createWebpackHotMiddleware(compiler);

    app.use(this.webpackDevMiddleware);
    app.use(this.webpackHotMiddleware);

    const listener = app.listen(7000, 'localhost');

    this.listenerManager = new ListenerManager(listener);

    compiler.plugin('compile', () => {
      console.log('Building new client bundle')
    })

    compiler.plugin('done', stats => {
      if (stats.hasErrors()) {
        console.error(stats.toString());
      } else {
        console.log('Running with latest client bundle');
      }
    })
  }

  dispose() {
    this.webpackDevMiddleware.close();

    return this.listenerManager
      ? this.listenerManager.dispose()
      : Promise.resolve();
  }
}

export default HotClientServer;

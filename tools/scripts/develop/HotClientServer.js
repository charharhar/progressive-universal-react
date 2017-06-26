import express from 'express';
import appRootDir from 'app-root-dir';
import createWebpackDevMiddleware from 'webpack-dev-middleware';
import createWebpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../config';
import { log } from '../../utils';

class ListenerManager {
  constructor(listener) {
    this.lastConnectionKey = 0;
    this.connectionMap = {};
    this.listener = listener;

    this.listener.on('connection', (connection) => {
      this.lastConnectionKey += 1;
      const connectionKey = this.lastConnectionKey;
      this.connectionMap[connectionKey] = connection;
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

        this.listener.close(() => {
          log({
            title: 'Client Server',
            message: 'Restarting client server',
            type: 'warn',
          })

          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

class HotClientServer {
  constructor(clientCompiler) {
    const app = express();

    this.webpackDevMiddleware = createWebpackDevMiddleware(clientCompiler, {
      quiet: true,
      noInfo: true,
      publicPath: clientCompiler.options.output.publicPath,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
    this.webpackHotMiddleware = createWebpackHotMiddleware(clientCompiler);

    app.use(this.webpackDevMiddleware);
    app.use(this.webpackHotMiddleware);

    const listener = app.listen(config.clientPort, config.host);

    this.listenerManager = new ListenerManager(listener);

    clientCompiler.plugin('compile', () => {
      log({
        title: 'Client Server',
        message: 'Building new client bundle',
        type: 'warn',
      })
    })

    clientCompiler.plugin('done', stats => {
      if (stats.hasErrors()) {
        console.error(stats.toString());
      } else {
        log({
          title: 'Client Server',
          message: 'Running with latest client bundle',
          notify: true,
        })
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

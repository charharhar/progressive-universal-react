import webpack from 'webpack';
import HotNodeServer from './HotNodeServer';
import HotClientServer from './HotClientServer';
import clientConfig from '../../webpack/webpack.client';
import serverConfig from '../../webpack/webpack.server';

class HotDevServers {
  constructor() {
    this.hotClientServer = null;
    this.hotNodeServer = null;

    Promise
      .resolve([
        webpack(clientConfig),
        webpack(serverConfig)
      ])
      // Then start the node development server(s).
      .then((resolve) => {
        this.hotClientServer = new HotClientServer(resolve[0]);
        return resolve[1]
      })
      .then((resolve) => {
        this.hotNodeServer = new HotNodeServer(resolve)
      });
  }

  dispose() {
    const safeDisposer = server => (
      server
        ? server.dispose()
        : Promise.resolve()
    );

    // First the hot client server.
    return safeDisposer(this.hotClientServer)
      // Then dispose the hot node server(s).
      .then(() => safeDisposer(this.hotNodeServer));
  }
}

export default HotDevServers;

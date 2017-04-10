import webpack from 'webpack';
import HotNodeServer from './HotNodeServer';
import HotClientServer from './HotClientServer';
import configFactory from '../../webpack/webpack.config';
import buildVendorDll from '../../webpack/vendordll.config';

const configObject = {
  target: 'none',
  mode: 'development',
};

class HotDevServers {
  constructor() {
    this.hotClientServer = null;
    this.hotNodeServer = null;

    Promise
      .resolve(buildVendorDll())
      .then(() => new Promise(resolve => {
        const clientConfig = Object.assign(configObject, { target: 'client' });
        const clientCompiler = webpack(configFactory(clientConfig));
        clientCompiler.plugin('done', stats => {
          if (!stats.hasErrors()) {
            resolve();
          }
        })
        this.hotClientServer = new HotClientServer(clientCompiler);
      }))
      .then(() => {
        const serverConfig = Object.assign(configObject, { target: 'server' });
        const serverCompiler = webpack(configFactory(serverConfig));
        this.hotNodeServer = new HotNodeServer(serverCompiler)
      });
  }

  dispose() {
    const safeDisposer = server => (
      server
        ? server.dispose()
        : Promise.resolve()
    );

    return safeDisposer(this.hotClientServer)
      .then(() => safeDisposer(this.hotNodeServer));
  }
}

export default HotDevServers;

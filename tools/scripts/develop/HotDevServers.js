import webpack from 'webpack';
import HotNodeServer from './HotNodeServer';
import HotClientServer from './HotClientServer';

import configFactory from '../../webpack/webpack.config';
import buildVendorDll from '../../webpack/vendordll.config';

import config from '../../config';
import { log } from '../../utils'

const { additionalNodeBundles } = config;

const initializeBundle = (name) => {
  const createCompiler = () => {
    try {
      const webpackConfig = configFactory({
        target: name,
        mode: 'development',
      });
      return webpack(webpackConfig);
    } catch (err) {
      log({
        title: 'development',
        level: 'error',
        message: 'Webpack config is invalid, please check the console for more information.',
        notify: true,
      });
      console.error(err);
      throw err;
    }
  };

  return { name, createCompiler };
};

class HotDevServers {
  constructor() {
    this.hotClientServer = null;
    this.hotNodeServers = [];

    const clientBundle = initializeBundle('client');
    const nodeBundles = [initializeBundle('server')]
      .concat(Object.keys(additionalNodeBundles).map(name =>
        initializeBundle(name)
      ));

    Promise
      .resolve(buildVendorDll())
      .then(() => new Promise(resolve => {
        const { createCompiler } = clientBundle;
        const clientCompiler = createCompiler();

        clientCompiler.plugin('done', stats => {
          if (!stats.hasErrors()) {
            resolve(clientCompiler);
          }
        })
        this.hotClientServer = new HotClientServer(clientCompiler);
      }))
      .then(() => {
        this.hotNodeServers = nodeBundles.map(({ createCompiler }) => {
          const serverCompiler = createCompiler();
          return new HotNodeServer(serverCompiler)
        })
      });
  }

  dispose() {
    const safeDisposer = server => (
      server ? server.dispose() : Promise.resolve()
    );

    return safeDisposer(this.hotClientServer)
      .then(() => Promise.all(this.hotNodeServers.map(safeDisposer)));
  }
}

export default HotDevServers;

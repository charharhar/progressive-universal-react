import chokidar from 'chokidar';
import path from 'path';
import appRootDir from 'app-root-dir';
import { log } from '../../utils';

let HotDevServers = require('./HotDevServers').default;
let devServer = new HotDevServers();

const watcher = chokidar.watch([
  path.resolve(appRootDir.get(), 'tools')
]);

watcher.on('ready', () => {
  watcher.on('change', () => {
    console.log('-------------------')
    log({
      title: 'Hot Servers',
      message: 'Build configuration changed. Restarting development servers',
      notify: true,
    })
    devServer.dispose().then(() => {
      Object.keys(require.cache).forEach((modulePath) => {
        if (modulePath.indexOf('tools') !== -1) {
          delete require.cache[modulePath];
        }
      });

      HotDevServers = require('./HotDevServers').default;
      devServer = new HotDevServers();

    })
  })
})

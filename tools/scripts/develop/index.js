import chokidar from 'chokidar';
import path from 'path';
import appRootDir from 'app-root-dir';

let HotDevServers = require('./HotDevServers').default;
let devServer = new HotDevServers();

const watcher = chokidar.watch([
  path.resolve(appRootDir.get(), 'tools')
]);

watcher.on('ready', () => {
  watcher.on('change', () => {
    console.log('Build configuration changed. Restarting development servers');
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

import chokidar from 'chokidar';
import path from 'path';
import appRootDir from 'app-root-dir';

let HotNodeServer = require('./HotNodeServer').default;
let devServer = new HotNodeServer();

const watcher = chokidar.watch([
  path.resolve(appRootDir.get(), 'tools')
]);

watcher.on('ready', () => {
  watcher.on('change', () => {
    console.log('Build configuration changed. Restarting devServer');
    devServer.dispose().then(() => {

      Object.keys(require.cache).forEach((modulePath) => {
        if (modulePath.indexOf('tools') !== -1) {
          delete require.cache[modulePath];
        }
      });

      HotNodeServer = require('./HotNodeServer').default;
      devServer = new HotNodeServer();
    })
  })
})

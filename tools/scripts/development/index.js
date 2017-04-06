import chokidar from 'chokidar';
import path from 'path';
import appRootDir from 'app-root-dir';

let HotNodeServer = require('./HotNodeServer').default;
let nodeServer = new HotNodeServer();
let HotClientServer = require('./HotClientServer').default;
let clientServer = new HotClientServer();

const watcher = chokidar.watch([
  path.resolve(appRootDir.get(), 'tools')
]);

watcher.on('ready', () => {
  watcher.on('change', () => {
    console.log('Build configuration changed. Restarting development servers');
    clientServer.dispose().then(() => {
      HotClientServer = require('./HotClientServer').default;
      clientServer = new HotClientServer();

      nodeServer.dispose().then(() => {
        Object.keys(require.cache).forEach((modulePath) => {
          if (modulePath.indexOf('tools') !== -1) {
            delete require.cache[modulePath];
          }
        });

        HotNodeServer = require('./HotNodeServer').default;
        nodeServer = new HotNodeServer();
      })
    })
  })
})

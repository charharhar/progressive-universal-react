import path from 'path';
import appRootDir from 'app-root-dir';
import webpack from 'webpack';
import serverConfig from '../../webpack/webpack.server';

import { spawn } from 'child_process';

class HotNodeServer {
  constructor() {
    const compiler = webpack(serverConfig);

    const compiledEntryFile = path.resolve(
      appRootDir.get(),
      compiler.options.output.path,
      `${Object.keys(compiler.options.entry)[0]}.js`
    )

    const startServer = () => {
      if (this.server) {
        this.server.kill();
        this.server = null;
        console.log('Restarting server');
      }

      const newServer = spawn('node', [compiledEntryFile]);
      console.log('Server running with latest changes');

      newServer.stdout.on('data', data => console.log(data.toString().trim()));
      newServer.stderr.on('data', (data) => {
        console.log('Error in server execution, check the console for more info.');
        console.error(data.toString().trim());
      });

      this.server = newServer;
    }

    compiler.plugin('compile', () => {
      console.log('Building new server bundle');
    })

    compiler.plugin('done', stats => {
      startServer();
    })

    this.bundleWatcher = compiler.watch(null, () => undefined);
  }

  dispose() {
    const stopWatcher = new Promise(resolve => {
      this.bundleWatcher.close(resolve);
    })

    return stopWatcher.then(() => {
      if (this.server) this.server.kill();
    })
  }
}

export default HotNodeServer;

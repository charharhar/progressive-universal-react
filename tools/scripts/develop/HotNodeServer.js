import path from 'path';
import appRootDir from 'app-root-dir';
import { spawn } from 'child_process';
import { log } from '../../utils'

class HotNodeServer {
  constructor(nodeCompiler) {
    const compiledEntryFile = path.resolve(
      appRootDir.get(),
      nodeCompiler.options.output.path,
      `${Object.keys(nodeCompiler.options.entry)[0]}.js`
    )

    const startServer = () => {
      if (this.server) {
        this.server.kill();
        this.server = null;
        log({
          title: 'Node Server',
          message: 'Restarting node server',
          type: 'warn',
        })
      }

      const newServer = spawn('node', [compiledEntryFile]);
      log({
          title: 'Node Server',
          message: 'Running with latest node bundle',
          notify: true,
        })

      newServer.stdout.on('data', data => console.log(data.toString().trim()));
      newServer.stderr.on('data', (data) => {
        log({
          title: 'Node Server',
          message: 'Error in server execution, check the console for more info.',
          notify: true,
          type: 'error',
        })
        console.error(data.toString().trim());
      });

      this.server = newServer;
    }

    nodeCompiler.plugin('compile', () => {
      log({
        title: 'Node Server',
        message: 'Building new node bundle',
        type: 'warn',
      })
    })

    nodeCompiler.plugin('done', stats => {
      startServer();
    })

    this.bundleWatcher = nodeCompiler.watch(null, () => undefined);
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

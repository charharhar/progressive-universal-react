import md5 from 'md5';
import fs from 'fs';
import webpack from 'webpack';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import config from '../config';
import { log } from '../utils';

const {
  dllConfig,
  clientOutputPath,
} = config

function createVendorDLL() {
  const pkg = require(pathResolve(appRootDir.get(), './package.json'));
  const devDLLDependencies = dllConfig.include.sort();
  const currentDependenciesHash = md5(JSON.stringify(
    devDLLDependencies.map(dep =>
      [dep, pkg.dependencies[dep], pkg.devDependencies[dep]],
    ),
  ));

  const vendorDLLHashFilePath = pathResolve(
    appRootDir.get(),
    clientOutputPath,
    `${dllConfig.name}_hash`,
  );

  function webpackConfigFactory() {
    return {
      devtool: 'inline-source-map',
      entry: {
        [dllConfig.name]: devDLLDependencies,
      },
      output: {
        path: pathResolve(appRootDir.get(), clientOutputPath),
        filename: `${dllConfig.name}.js`,
        library: dllConfig.name,
      },
      plugins: [
        new webpack.DllPlugin({
          path: pathResolve(
            appRootDir.get(),
            clientOutputPath,
            `./${dllConfig.name}.json`,
          ),
          name: dllConfig.name,
        }),
      ],
    };
  }

  function buildVendorDLL() {
    return new Promise((resolve, reject) => {
      log({
        title: 'vendorDLL',
        level: 'info',
        message: `Vendor DLL build complete. The following dependencies have been included:\n\t-${devDLLDependencies.join('\n\t-')}\n`,
      });

      const webpackConfig = webpackConfigFactory();
      const vendorDLLCompiler = webpack(webpackConfig);
      vendorDLLCompiler.run((err) => {
        if (err) {
          reject(err);
          return;
        }

        fs.writeFileSync(vendorDLLHashFilePath, currentDependenciesHash);

        resolve();
      });
    });
  }

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(vendorDLLHashFilePath)) {
      log({
        title: 'vendorDLL',
        level: 'warn',
        message: `Generating a new client Vendor DLL for boosted development performance.`
      });
      buildVendorDLL().then(resolve).catch(reject);
    } else {
      const dependenciesHash = fs.readFileSync(vendorDLLHashFilePath, 'utf8');
      const dependenciesChanged = dependenciesHash !== currentDependenciesHash;

      if (dependenciesChanged) {
        log({
          title: 'vendorDLL',
          level: 'warn',
          message: `New client vendor dependencies detected. Regenerating the vendor dll.`,
        });
        buildVendorDLL().then(resolve).catch(reject);
      } else {
        log({
          title: 'vendorDLL',
          level: 'info',
          message: `No changes to existing client vendor dependencies. Using the existing vendor dll.`,
        });
        resolve();
      }
    }
  });
}

export default createVendorDLL;


import webpack from 'webpack';
import configFactory from '../webpack/webpack.config';
import { createConfigObject, log } from '../utils';
import config from '../config';

const { bundles, additionalNodeBundles } = config;

const configBundles = Object.keys(bundles)
  .concat(Object.keys(additionalNodeBundles))
  .forEach(bundleName => {
    const compiler = webpack(
      configFactory({ target: bundleName, mode: 'production' })
    );

    compiler.run((err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stats.toString({ colors: true }));
    })
  })


import path from 'path';
import webpack from 'webpack';
import appRootDir from 'app-root-dir';
import configFactory from '../webpack/webpack.config';
import { createConfigObject, log } from '../utils';
import config from '../config';

const { configProduction, targetClient, targetServer } = config;
const configBundles = [
  createConfigObject(configProduction, targetClient),
  createConfigObject(configProduction, targetServer)
].forEach(config => {
    const compiler = webpack(configFactory(config));

    compiler.run((err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stats.toString({ colors: true }));
    })
  })

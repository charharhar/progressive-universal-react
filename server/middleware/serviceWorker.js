import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import config from '../../tools/config';

export default function serviceWorker(req, res, next) {
  res.sendFile(
    pathResolve(
      appRootDir.get(),
      config.clientOutputPath,
      './sw.js'
    )
  )
}

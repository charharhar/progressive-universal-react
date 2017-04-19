import { readFile as fsReadFile } from 'fs';
import { resolve as pathResolve } from 'path';
import appRootDir from 'app-root-dir';
import config from '../../tools/config';

export default function offlinePage(req, res, next) {
  fsReadFile(
    pathResolve(
      appRootDir.get(),
      config.clientOutputPath,
      `./${config.offlinePageName}`
    ),
    'utf-8',
    (err, data) => {
      if (err) {
        res.status(500).send('Error returning offline page');
        return;
      }

      res.send(data);
    }
  )
}

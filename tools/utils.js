
import chalk from 'chalk';
import notifier from 'node-notifier';
import appRootDir from 'app-root-dir';

export function log(options) {
  const title = `${options.title.toUpperCase()}`;
  const type = options.type;
  const msg = `==> ${title} -> ${options.message}`;

  if (options.notify) {
    notifier.notify({
      title,
      message: options.message,
    });
  }

  switch (type) {
    case 'warn': console.log(chalk.yellow(msg)); break;
    case 'error': console.log(chalk.bgRed.white(msg)); break;
    case 'info': console.log(chalk.blue(msg)); break;
    default: console.log(chalk.green(msg));
  }
}

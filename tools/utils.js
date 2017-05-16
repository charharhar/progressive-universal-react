
import chalk from 'chalk';
import notifier from 'node-notifier';
import appRootDir from 'app-root-dir';

export function log (options) {
  const title = `${options.title.toUpperCase()}`;
  const type = options.type;
  const msg = `==> ${chalk.bold(title)} -> ${options.message}`;

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

export function removeEmpty (x) {
  return x.filter(y => y != null);
}

export function ifElse (condition) {
  return function ifElseResolver (then, or) {
    const execIfFunc = x => (typeof x === 'function' ? x() : x);
    return condition ? execIfFunc(then) : (or);
  }
}


import path from 'path';
import appRootDir from 'app-root-dir';
import { execSync } from 'child_process';

const command = `$(npm bin)/rimraf build tunnel`;
execSync(command, { stdio: 'inherit', cwd: appRootDir.get() });

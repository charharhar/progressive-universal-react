import helmet from 'helmet';
import config from '../../tools/config';

const security = [

  helmet.xssFilter(),

  helmet.frameguard('deny'),

  helmet.ieNoOpen(),

  helmet.noSniff(),
];

export default security;

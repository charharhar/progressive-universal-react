import helmet from 'helmet';
import config from '../../tools/config';

const cspConfig = {
  directives: {
    childSrc: ["'self'"],
    connectSrc: ['*'],
    defaultSrc: ["'self'"],
    imgSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'self'"],
    mediaSrc: ["'self'"],
    manifestSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'blob:',
    ]
  }
}

// if (process.env.NODE_ENV === 'development') {
//   Object.keys(cspConfig.directives).forEach((directive) => {
//     cspConfig.directives[directive].push(
//       `${config.host}:${config.clientPort}`,
//     );
//   });
// }

const security = [
  helmet.xssFilter(),

  helmet.frameguard('deny'),

  helmet.ieNoOpen(),

  helmet.noSniff(),
];

if (process.env.NODE_ENV === 'production') {
  security.push(helmet.contentSecurityPolicy(cspConfig));
}

export default security;

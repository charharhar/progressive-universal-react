
const config = {

  host: 'localhost',

  clientPort: 7000,

  serverPort: 3000,

  staticPath: '/static',

  clientOutputPath: './build/client',

  serverOutputPath: './build/server',

  configDevelop: { mode: 'development' },

  configProduction: { mode: 'production' },

  targetClient: { target: 'client' },

  targetServer: { target: 'server' },

}

export default config;

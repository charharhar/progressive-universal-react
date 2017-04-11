
const config = {

  host: 'localhost',

  clientPort: 7000,

  serverPort: `${process.env.ENABLE_TUNNEL === 'true' ? 1337 : 3000}`,

  staticPath: '/static',

  buildPathName: `${process.env.ENABLE_TUNNEL === 'true' ? 'tunnel' : 'build'}`,

  clientOutputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/client' : './build/client'}`,

  serverOutputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/server' : './build/server'}`,

  configDevelop: { mode: 'development' },

  configProduction: { mode: 'production' },

  targetClient: { target: 'client' },

  targetServer: { target: 'server' },

}

export default config;


const config = {

  host: 'localhost',

  clientPort: 7000,

  serverPort: `${process.env.ENABLE_TUNNEL === 'true' ? 1337 : 3000}`,

  webPath: '/client',

  clientOutputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/client' : './build/client'}`,

  serverOutputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/server' : './build/server'}`,

  configDevelop: { mode: 'development' },

  configProduction: { mode: 'production' },

  targetClient: { target: 'client' },

  targetServer: { target: 'server' },

  title: 'Universal React Starter',

  description: 'A production ready universal react starter kit.'
}

export default config;


const config = {
  title: 'Universal React Starter',

  description: 'A production ready universal react starter kit.',

  host: 'localhost',

  clientPort: 7000,

  serverPort: `${process.env.ENABLE_TUNNEL === 'true' ? 1337 : 3000}`,

  webPath: '/client',

  publicPath: './public',

  clientOutputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/client' : './build/client'}`,

  serverOutputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/server' : './build/server'}`,

  configDevelop: { mode: 'development' },

  configProduction: { mode: 'production' },

  targetClient: { target: 'client' },

  targetServer: { target: 'server' },

  cssLoaderOptions: {
    modules: true,
    importLoaders: 1,
    localIdentName: '[name]__[local]___[hash:base64:5]',
    minimize: process.env.NODE_ENV === 'production',
    discardComments: { removeAll: process.env.NODE_ENV === 'production' }
  },

}

export default config;

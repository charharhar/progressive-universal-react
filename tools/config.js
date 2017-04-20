
const config = {
  title: 'Progressive Universal React',

  description: 'A production ready progressive universal react starter kit.',

  host: 'localhost',

  clientPort: 7000,

  serverPort: `${process.env.ENABLE_TUNNEL === 'true' ? 1337 : 3000}`,

  webPath: '/client/',

  publicPath: './public',

  clientOutputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/client' : './build/client'}`,

  serverOutputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/server' : './build/server'}`,

  configDevelop: { mode: 'development' },

  configProduction: { mode: 'production' },

  targetClient: { target: 'client' },

  targetServer: { target: 'server' },

  dllConfig: {
    name: 'vendorDll',
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },

  cssLoaderOptions: {
    modules: true,
    importLoaders: 1,
    localIdentName: '[name]__[local]___[hash:base64:5]',
    minimize: process.env.NODE_ENV === 'production',
    discardComments: { removeAll: process.env.NODE_ENV === 'production' },
  },

  offlinePageName: 'offline.html',

  // Inline Script Elements
  jsonLd: `{
    "@context": "http://schema.org",
    "@type": "Organization",
    "url": "http://www.your-company-site.com",
    "logo": "http://www.example.com/logo.png",
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+1-401-555-1212",
      "contactType": "customer service"
    }]
  }`,

  clientConfig: `window.__CLIENT_CONFIG__ = {
    "serviceWorker":{"enabled":true}
  }`,

}

export default config;

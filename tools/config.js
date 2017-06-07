
const config = {
  title: 'Progressive Universal React',

  description: 'A production ready progressive universal react starter kit.',

  host: 'localhost',

  clientPort: 7000,

  clientOutputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/client' : './build/client'}`,

  serverPort: `${process.env.ENABLE_TUNNEL === 'true' ? 1337 : 3000}`,

  webPath: '/client/',

  publicPath: './public',

  bundles: {
    client: {
      entryPath: './client/index.js',
      srcPaths: [
        './client',
        './shared',
        './config',
      ],
      outputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/client' : './build/client'}`,
    },

    server: {
      entryPath: './server/index.js',
      srcPaths: [
        './server',
        './shared',
        './config',
      ],
      outputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/server' : './build/server'}`,
    }
  },

  additionalNodeBundles: {
    // apiServer: {
    //   srcEntryFile: './api/index.js',
    //   srcPaths: [
    //     './api',
    //     './shared',
    //     './config',
    //   ],
    //   outputPath: `${process.env.ENABLE_TUNNEL === 'true' ? './tunnel/api' : './build/api'}`
    // }
  },

  dllConfig: {
    name: 'vendorDll',
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },

  cssLoaderOptions: (mode) => ({
    modules: true,
    importLoaders: 1,
    localIdentName: '[name]__[local]___[hash:base64:5]',
    minimize: mode === 'production',
    discardComments: { removeAll: mode === 'production' },
    sourceMap: mode === 'development',
  }),

  postCssLoaderOptions: (mode) => ({
    sourceMap: mode === 'development',
    config: {
      path: './tools/webpack/postcss.config.js',
    }
  }),

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

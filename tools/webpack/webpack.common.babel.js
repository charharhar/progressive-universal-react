
export const JS_LOADER = {
  test: /\.js$/,
  exclude: '/node_modules/',
  use: 'babel-loader',
};
export const JSON_LOADER = {
  test: /\.json$/,
  use: 'json-loader',
};
export const CSS_LOADER_OPTIONS = {
  modules: true,
  importLoaders: 1,
  localIdentName: '[name]__[local]___[hash:base64:5]',
};

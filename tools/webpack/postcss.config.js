
module.exports = {
  plugins: [
    // Autoprefixer for cross browser CSS support
    require('autoprefixer'),
    // Include SASS like support in CSS files
    require('precss'),
    // Fixes flex property bugs
    require('postcss-flexbugs-fixes'),
  ]
}

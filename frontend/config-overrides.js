const webpack = require("webpack");
module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.resolve.fallback = {
    url: require.resolve("url"),
    assert: require.resolve("assert"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
    fs: false,
    // os: false,
    path: false,
    // externals: ["pg", "sqlite3", "tedious", "pg-hstore"]
  };
  // config = {
  // externals: ['pg', 'sqlite3', 'tedious', 'pg-hstore'],
  // plugins: [
  //     new webpack.ContextReplacementPlugin(
  //       /Sequelize(|/)/,
  //       path.resolve(__dirname, './src'),
  //     ),
  //   ],
  // }
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });
  return config;
};

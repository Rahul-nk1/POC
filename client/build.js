const build = require("@discovery/client-core/build-clients");

build.buildClients({
  buildInfraConfig: require("./build-infra-config.json"),
  MAX_CONCURRENT_BUILDS: 10,
  webpackConfigPath: require.resolve("./webpack.config.js"),
});

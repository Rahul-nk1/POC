const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const baseWebpack = require("@discovery/client-core/webpack.dev.config");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const createStyledComponentsTransformer = require("typescript-plugin-styled-components")
  .default;
const {
  node_modules_except_discovery_modules_containing_JSX,
} = require("./webpack.common.config");
const styledComponentsTransformer = createStyledComponentsTransformer();

const LOGO = path.resolve("./assets/logo.png");

const host = "0.0.0.0";
const product = process.env.PRODUCT || "tlc";
const sonicEndpoint = process.env.SONIC_ENDPOINT;

if (!sonicEndpoint) {
  throw new Error("You must specify a SONIC_ENDPOINT env variable.");
}

const conf = require(path.resolve(__dirname, "./webpack/", product));

const VARS = {
  "~brand": path.resolve(`assets/${product}`),
  "~global": path.resolve(`assets/_global`),
  "@discovery/common-tve/lib": path.resolve(__dirname, "../common/src"),
  "@discovery/components-tve/lib": path.resolve(__dirname, "../components/src"),
};

module.exports = {
  ...baseWebpack,
  mode: "development",
  devServer: {
    ...baseWebpack.devServer,
    host,
  },
  entry: path.resolve("./src/index.ts"),
  resolve: {
    ...baseWebpack.resolve,
    alias: {
      ...baseWebpack.resolve.alias,
      ...VARS,
    },
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  devtool: "source-map",
  module: {
    ...baseWebpack.module,
    rules: [
      {
        oneOf: [
          {
            test: /\.(jsx?|tsx?)$/,
            use: {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
                getCustomTransformers: () => ({
                  before: [styledComponentsTransformer],
                }),
              },
            },
            exclude: [node_modules_except_discovery_modules_containing_JSX],
          },
          {
            test: /\.css$/,
            use: [
              "style-loader",
              {
                loader: "typings-for-css-modules-loader",
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: "[name]-[local]-[hash:base64:8]",
                  namedExport: true,
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  config: {
                    ctx: {
                      "postcss-import-resolver": {
                        alias: VARS,
                      },
                    },
                  },
                },
              },
            ],
          },
          {
            loader: "file-loader",
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...baseWebpack.plugins,
    new CopyWebpackPlugin(["./assets/robots.txt"]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom",
    }),
    new webpack.EnvironmentPlugin({
      VERSION: "dev",
    }),
    new webpack.EnvironmentPlugin(["PRODUCT"]),
    new HtmlWebpackPlugin({
      mobile: true,
      filename: "index.html",
      template: "./assets/index.html",
      templateParameters: {
        GTM_ID: conf.html.gtm.id,
        GTM_AUTH: conf.html.gtm.auth,
        GTM_ENV: conf.html.gtm.env,
      },
      title: conf.html.title,
    }),
    new WebpackPwaManifest({
      name: "TVE app",
      short_name: "The TVE App",
      description: "This is an application to watch shows",
      theme_color: "#ffffff",
      background_color: "#000000",
      crossorigin: "use-credentials",
      icons: [
        {
          src: LOGO,
          sizes: [96, 128, 192, 256, 384, 512],
        },
      ],
    }),
    new FaviconsWebpackPlugin({
      logo: LOGO,
    }),
    // TODO: Implement this on core
    // Followup https://discoveryinc.atlassian.net/browse/LDW-3126
  ],
};

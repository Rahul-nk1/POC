const path = require("path");
const webpack = require("webpack");
const baseWebpack = require("@discovery/client-core/webpack.config");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const build = require("@discovery/client-core/build-clients");
const fs = require("fs");
const {
  node_modules_except_discovery_modules_containing_JSX,
} = require("./webpack.common.config");

const base = (brand) => {
  const VARS = {
    "~brand": path.resolve(__dirname, `assets/${brand}`),
    "~global": path.resolve(__dirname, `assets/_global`),
    // TODO: this should use compiled output, but for now doing that seems to be
    // generating bogus output
    "@discovery/common-tve/lib": path.resolve(__dirname, "../common/src"),
    "@discovery/components-tve/lib": path.resolve(
      __dirname,
      "../components/src"
    ),
  };

  const conf = require(path.resolve(__dirname, "./webpack/", brand));
  const favicon = path.resolve(__dirname, `./assets/${brand}/img/favicon.png`);
  if (!fs.existsSync(favicon)) {
    throw new Error(`Build failure: Favicon doesn’t exist - Brand: ${brand}`);
  }
  return {
    ...baseWebpack,
    mode: "production",
    entry: path.resolve("./src/index.ts"),
    output: {
      ...baseWebpack.output,
      path: path.resolve("./dist") + "/" + brand,
    },
    resolve: {
      ...baseWebpack.resolve,
      alias: {
        ...VARS,
      },
    },
    module: {
      ...baseWebpack.module,
      rules: [
        {
          oneOf: [
            {
              test: /\.(j|t)sx?/,
              use: {
                loader: require.resolve("ts-loader"),
                options: {
                  transpileOnly: true,
                  configFile: path.resolve(__dirname, "tsconfig.json"),
                },
              },
              exclude: [node_modules_except_discovery_modules_containing_JSX],
            },
            {
              test: /\.css$/,
              use: [
                "style-loader",
                "typings-for-css-modules-loader?module&localIdentName=[local]-[hash:base64:8]&importLoaders=1&namedExport",
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
            // ...baseWebpack.module.rules ˿ This was causing the build failure on the CI. Verified it works without.
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
      new webpack.ProvidePlugin({
        React: "react",
        ReactDOM: "react-dom",
      }),
      new webpack.EnvironmentPlugin({
        PRODUCT: brand,
        LAST_COMMIT: "unknown-hash",
        VERSION: "dev",
      }),
      new HtmlWebpackPlugin({
        mobile: true,
        filename: "index.html",
        template: "./assets/index.html",
        templateParameters: {
          GTM_ID: (conf.html.gtm && conf.html.gtm.id) || "GTM-544SVFJ",
          GTM_AUTH: (conf.html.gtm && conf.html.gtm.auth) || "",
          GTM_ENV: (conf.html.gtm && conf.html.gtm.env) || "",
        },
        title: conf.html.title,
      }),
      new WebpackPwaManifest({
        name: conf.pwaManifest.name,
        short_name: conf.pwaManifest.short_name,
        description: conf.pwaManifest.description,
        theme_color: conf.pwaManifest.theme_color,
        background_color: conf.pwaManifest.background_color,
        crossorigin: "use-credentials",
        icons: [
          {
            src: conf.pwaManifest.MASKABLE_ICON,
            type: "image/png",
            sizes: [96, 128, 192, 256, 384, 512],
            purpose: "maskable",
          },
          {
            src: conf.pwaManifest.LOGO,
            type: "image/png",
            sizes: [96, 128, 192, 256, 384, 512],
          },
        ],
      }),
      new FaviconsWebpackPlugin({
        logo: favicon,
      }),
    ],
  };
};

module.exports = build.createWorkerProcess(base);

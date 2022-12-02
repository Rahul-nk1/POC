const path = require("path");
const webpack = require("webpack");
const {
  node_modules_except_discovery_modules_containing_JSX,
} = require("../client/webpack.common.config");

const product = process.env.PRODUCT || "tlc";

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

const VARS = {
  "~brand": path.resolve(__dirname, "../client", `assets/${product}`),
  "~global": path.resolve(__dirname, "../client", `assets/_global`),
  "@discovery/common-tve/lib": path.resolve(__dirname, "../common/src"),
  "@discovery/components-tve": path.resolve(__dirname, "../components"),
};

module.exports = {
  mode: "development",
  resolve: {
    extensions: [".ts", ".tsx", ".json", ".js", ".jsx", ".mjs", ".css"],
    alias: {
      ...VARS,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom",
    }),
    new webpack.EnvironmentPlugin(["PRODUCT"]),
  ],
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(j|t)sx?$/,
            use: {
              loader: require.resolve("ts-loader"),
              options: {
                transpileOnly: true,
                configFile: path.resolve(__dirname, "tsconfig.cosmos.json"),
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
          {
            loader: "file-loader",
            exclude: [/\.(js|ejs|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
};

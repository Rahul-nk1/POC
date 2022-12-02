module.exports = ({ options: ctxOptions }) => ({
  plugins: {
    "postcss-import": {
      /**
       * NOTE - beacause `postcss-import-resolver` doesn't do well with local paths
       * - but does allow webpack aliases to work -
       * we need to wrap it in the default postcss-import resolver
       *
       * the default `postcss-import` resolver will fail when it encounters an alias
       * so when it does, we pass it through to `postcss-import-resolver`
       * for proper resolution
       *
       * it works! and gets around hairy custom logic
       *
       * TODO: Investigate if there is a cleaner approach for importing relative and aliased
       * paths.
       */
      resolve: (id, basedir, options) =>
        require("postcss-import/lib/resolve-id")(
          id,
          basedir,
          options
        ).catch(() =>
          require("postcss-import-resolver")(
            ctxOptions["postcss-import-resolver"]
          )(id, basedir, options)
        ),
    },
    "postcss-for": {},
    "postcss-mixins": {},
    "postcss-simple-vars": {},
    "postcss-strip-units": {},
    "postcss-hexrgba": {},
    "postcss-nested": {},
    "postcss-extend-rule": {},
    "postcss-preset-env": {
      autoprefixer: {
        flexbox: "no-2009",
      },
      stage: 0,
    },
    "postcss-url": {},
    "postcss-calc": {},
    autoprefixer: { grid: "autoplace" },
  },
});

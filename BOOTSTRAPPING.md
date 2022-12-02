## Concert client template

This repository contains suggestet monorepo layout for _Concert_ based _Discovery_
clients.

# Setup procedure

- [ ] Set brand name in `package.json`.
- [ ] Set brand name in `components/package.json`, and `components/default.nix`.
- [ ] Set brand name in `client/package.json`, and `client/default.nix`.
- [ ] Set components name in `client/default.nix` dependency.
- [ ] Set components name in `client/tsconfig.json` paths dependency.
- [ ] Change the brand name in the `client/assets/index.html`.
- [ ] Change the brand name in the `client/webpack.dev.config.js`.
- [ ] Change the brand name in the `client/webpack.config.js`.
- [ ] Change the brand name in the `client/postcss.config.js`.
- [ ] Change the brand name in the `package.json` scripts `dev`, `prod`, `clean` and `cosmos`.
- [ ] Change the name of the _dependency_ on _components_ package,
      in the `client/package.json`.
- [ ] Run initial `yarn install` to populate `yarn.lock`

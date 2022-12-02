let
  pkgs = import <nixpkgs> {};
  node = pkgs.nodejs-12_x;
in

pkgs.stdenv.mkDerivation {
  name = "concert-env";
  buildInputs = with pkgs; [
    b2sum
    circleci-cli
    fish
    git
    jq
    nix
    node
    python
    shellcheck
    vips
    glib
    (yarn.override { nodejs = node; })
  ];

  shellHook = ''
      export CONCERT_NIX_SHELL="1"
      export PATH=$PWD/node_modules/.bin:$PATH
  '';
}
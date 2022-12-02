const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is The Destination America",
  },
  pwaManifest: {
    name: "Destination America",
    short_name: "DES",
    description: "Destination America produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    MASKABLE_ICON: LOGO,
    LOGO,
  },
};

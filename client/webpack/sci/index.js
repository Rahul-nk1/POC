const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is SCI",
  },
  pwaManifest: {
    name: "SCI APP",
    short_name: "SCI stands for the science channel",
    description: "SCI produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    LOGO: LOGO,
    MASKABLE_ICON: LOGO,
  },
};

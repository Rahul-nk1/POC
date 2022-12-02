const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is IDS",
  },
  pwaManifest: {
    name: "IDS APP",
    short_name: "IDS stands for something",
    description: "IDS produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    LOGO: LOGO,
    MASKABLE_ICON: LOGO,
  },
};

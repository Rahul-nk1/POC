const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is American Heroes",
  },
  pwaManifest: {
    name: "American Heroes",
    short_name: "AHC",
    description: "American Heroes produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    MASKABLE_ICON: LOGO,
    LOGO,
  },
};

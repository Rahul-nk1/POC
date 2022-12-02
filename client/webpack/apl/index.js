const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is Animal Planet",
  },
  pwaManifest: {
    name: "Animal Planet",
    short_name: "APL",
    description: "Animal Planet produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    MASKABLE_ICON: LOGO,
    LOGO,
  },
};

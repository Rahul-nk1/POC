const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is DFL",
  },
  pwaManifest: {
    name: "DFL APP",
    short_name: "DFL stands Discovery Life",
    description: "DFL produces fitness shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    LOGO: LOGO,
    MASKABLE_ICON: LOGO,
  },
};

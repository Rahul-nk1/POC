const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is HGTV",
  },
  pwaManifest: {
    name: "HGTV APP",
    short_name: "HGTV stands for the Home & Garden TV",
    description: "HGTV produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    LOGO: LOGO,
    MASKABLE_ICON: LOGO,
  },
};

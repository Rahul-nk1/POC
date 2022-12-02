const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is DSC",
  },
  pwaManifest: {
    name: "DSC APP",
    short_name: "DSC stands for for discovery channel",
    description: "DSC produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    LOGO: LOGO,
    MASKABLE_ICON: LOGO,
  },
};

const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is DIY",
  },
  pwaManifest: {
    name: "DIY APP",
    short_name: "DIY stands for something",
    description: "DIY produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    LOGO: LOGO,
    MASKABLE_ICON: LOGO,
  },
};

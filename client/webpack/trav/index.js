const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is TRAV",
  },
  pwaManifest: {
    name: "TRAV APP",
    short_name: "TRAV stands for something",
    description: "TRAV produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    LOGO: LOGO,
    MASKABLE_ICON: LOGO,
  },
};

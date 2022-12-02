const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is The Cooking Network",
  },
  pwaManifest: {
    name: "Cooking Network",
    short_name: "COOK",
    description: "Cooking Network produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    MASKABLE_ICON: LOGO,
    LOGO,
  },
};

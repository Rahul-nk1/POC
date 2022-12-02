const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is VEL",
  },
  pwaManifest: {
    name: "VEL APP",
    short_name: "VEL stands for velocity",
    description: "Velocity has the best shows about cars in the world",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    LOGO,
    MASKABLE_ICON: LOGO,
  },
};

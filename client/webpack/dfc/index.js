const path = require("path");
const LOGO = path.resolve(__dirname, "../../assets/logo.png");

module.exports = {
  html: {
    title: "This is DFC",
  },
  pwaManifest: {
    name: "DFC APP",
    short_name: "DFC stands for the learning channel",
    description: "DFC produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    LOGO: LOGO,
    MASKABLE_ICON: LOGO,
  },
};

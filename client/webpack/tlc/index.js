const path = require("path");
const MASKABLE_ICON = path.resolve(__dirname, "./maskable_icon.png");
const LOGO = path.resolve(__dirname, "./logo.png");
const FAVICON = path.resolve(__dirname, "./logo.png");

module.exports = {
  html: {
    title: "This is TLC",
    gtm: {
      id: "GTM-544SVFJ",
      auth: "TAkAIJdHhCEUA7I5lnbSaQ",
      env: "317",
    },
  },
  pwaManifest: {
    name: "TLC APP",
    short_name: "TLC stands for the learning channel",
    description: "TLC produces shows",
    theme_color: "#44BBBB",
    background_color: "#44bba4",
    MASKABLE_ICON,
    LOGO,
  },
  FAVICON,
};

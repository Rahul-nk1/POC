const logIfReady = () => {
  if (window.document.readyState === "complete") {
    console.info("COSMOS DONE");
  }
};

export default ({ children }) => {
  logIfReady();
  window.addEventListener("load", logIfReady);
  return children;
};

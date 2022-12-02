const getScreenName = (path: string): string => {
  const [, location, title] = path.split("/");
  if (location === undefined) {
    return "unknown-route";
  } else if (location === "show" && title !== undefined) {
    return `${location}/${title}`;
  }

  return location === "" ? "home" : location;
};

export { getScreenName };

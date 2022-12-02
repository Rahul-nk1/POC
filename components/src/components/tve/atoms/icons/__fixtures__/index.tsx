import * as Icons from "..";

const Contain = (Module: JSX.Element) => (
  <div style={{ width: "3em", height: "4em", margin: "2em" }}>{Module}</div>
);

export default {
  Chevron: Contain(<Icons.Chevron />),
  "Lock (light)": Contain(<Icons.LockIcon theme={Icons.IconTheme.light} />),
  "Lock (dark)": Contain(<Icons.LockIcon theme={Icons.IconTheme.dark} />),
  "Play (light)": Contain(<Icons.PlayIcon theme={Icons.IconTheme.light} />),
  "Play (dark)": Contain(<Icons.PlayIcon theme={Icons.IconTheme.dark} />),
  Search: Contain(<Icons.Search />),
  "User (light)": Contain(<Icons.User />),
  "User (dark)": Contain(<Icons.User black />),
};

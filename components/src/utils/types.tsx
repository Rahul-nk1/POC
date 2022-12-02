export enum Tags {
  a = "a",
  anchor = "a",
  button = "button",
  div = "div",
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
  h5 = "h5",
  h6 = "h6",
  img = "img",
  image = "img",
  p = "p",
  label = "label",
  small = "small",
  span = "span",
}

export enum AriaRoles {
  alert = "alert",
  alertdialog = "alertdialog",
  application = "application",
  article = "article",
  banner = "banner",
  button = "button",
  checkbox = "checkbox",
  columnheader = "columnheader",
  combobox = "combobox",
  command = "command",
  complementary = "complementary",
  composite = "composite",
  contentinfo = "contentinfo",
  definition = "definition",
  dialog = "dialog",
  directory = "directory",
  document = "document",
  form = "form",
  grid = "grid",
  gridcell = "gridcell",
  group = "group",
  heading = "heading",
  img = "img",
  input = "input",
  landmark = "landmark",
  link = "link",
  list = "list",
  listbox = "listbox",
  listitem = "listitem",
  log = "log",
  main = "main",
  marquee = "marquee",
  math = "math",
  menu = "menu",
  menubar = "menubar",
  menuitem = "menuitem",
  menuitemcheckbox = "menuitemcheckbox",
  menuitemradio = "menuitemradio",
  navigation = "navigation",
  note = "note",
  option = "option",
  presentation = "presentation",
  progressbar = "progressbar",
  radio = "radio",
  radiogroup = "radiogroup",
  range = "range",
  region = "region",
  roletype = "roletype",
  row = "row",
  rowgroup = "rowgroup",
  rowheader = "rowheader",
  scrollbar = "scrollbar",
  search = "search",
  section = "section",
  sectionhead = "sectionhead",
  select = "select",
  separator = "separator",
  slider = "slider",
  spinbutton = "spinbutton",
  status = "status",
  structure = "structure",
  tab = "tab",
  tablist = "tablist",
  tabpanel = "tabpanel",
  textbox = "textbox",
  timer = "timer",
  toolbar = "toolbar",
  tooltip = "tooltip",
  tree = "tree",
  treegrid = "treegrid",
  treeitem = "treeitem",
  widget = "widget",
  window = "window",
}

type EventHandler<EventType, Returning> = (event: EventType) => Returning;
export type ClickHandler = EventHandler<React.MouseEvent, void>;

export type UrlSearchParams = {
  key: string;
  value: string;
};

// Taken from https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286#50375286
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

// These are all possible Element types that can be produced from our set of Tags
export type Element<
  T extends keyof HTMLElementTagNameMap
> = UnionToIntersection<HTMLElementTagNameMap[T]>;

export type Ref<T extends keyof HTMLElementTagNameMap> = React.RefObject<
  Element<T>
>;

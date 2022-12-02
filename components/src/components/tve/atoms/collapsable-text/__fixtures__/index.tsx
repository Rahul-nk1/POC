import * as M from "@discovery/prelude/lib/data/maybe";
import parse from "html-react-parser";

import { CollapsableText } from "../";

export default {
  "Collapsable text with button": (
    <CollapsableText
      limitM={M.of(230)}
      text={parse(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      )}
    />
  ),
  "Collapsable text including html elements with button": (
    <CollapsableText
      limitM={M.of(230)}
      text={parse(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum <a href='https://www.discovery.com/'>Discovery</a> "
      )}
    />
  ),
  "Collapsable text without button": (
    <CollapsableText
      limitM={M.of(230)}
      text={parse("Lorem ipsum dolor sit amet, consectetur ")}
    />
  ),
};

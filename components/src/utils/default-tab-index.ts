import * as M from "@discovery/prelude/lib/data/maybe";

/*
  defaultTabIndex, that is used for network-selector on shows page
  uses indexing starting with `1` for ease for editors.
  `parseDefaultTabIndex` parses the `Maybe<number>`
  return a `number` that is using zero indexing
*/

export const parseDefaultTabIndex = (numM: M.Maybe<string>) =>
  Math.max(
    0,
    M.fromMaybe(
      M.map((x) => {
        const int = parseInt(x, 10);
        return Number.isNaN(int) ? 1 : int;
      }, numM),
      1
    ) - 1
  );

import * as L from "@discovery/prelude/lib/data/list";
import * as M from "@discovery/prelude/lib/data/maybe";
import * as NE from "@discovery/prelude/lib/data/nonempty";
import type { ComponentType } from "react";

export type ItemProps = {
  index: number;
};

/** @deprecated */
export const safeNthItemRenderer = (
  i: number,
  l: NE.NonEmpty<ComponentType<ItemProps>>
) => M.maybe(<></>, (V) => <V index={i} key={i} />, NE.nth(i, l));

export function shouldPaginate<T>(videoL: L.List<T>, index: number, limit = 3) {
  return L.length(videoL) - index <= limit;
}

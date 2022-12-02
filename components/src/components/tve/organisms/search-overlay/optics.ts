import * as L from "@discovery/prelude/lib/data/list";
import * as RD from "@discovery/prelude/lib/data/remote-data";
import { Fold } from "@discovery/prelude/lib/control/lens";
import {
  _RouteResponse2Route,
  _Route2Page,
  _PageItem2Collection,
  _Col2Items,
  _Page2Items,
} from "@discovery/sonic-api-ng-optics";
import { RouteResponse } from "@discovery/sonic-api-ng/lib/api/cms/routes/resource";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { List } from "@discovery/prelude/lib/data/list";
import { shouldDisplayLock } from "../../molecules/card/utils";
import { _Col2ContentGridCardData } from "../../../../site-builder/tve/components/content-grid/optics";

export const toListRD = <S, A>(
  f: Fold.Fold<S, A>,
  rd: RD.RemoteData<unknown, S>
) => RD.map((data) => Fold.toList(f, data), rd);

export const _RouteResponse2ContentGridDataList: Fold.Fold<
  RouteResponse,
  CollectionResponseData
> = Fold.compose(
  _RouteResponse2Route,
  _Route2Page,
  _Page2Items,
  _PageItem2Collection
);

export const countResults = (response: RouteResponse) => {
  const l: L.List<CollectionResponseData> = Fold.toList(
    _RouteResponse2ContentGridDataList,
    response
  );

  return L.foldl(
    (sum, data) => sum + L.length(Fold.toList(_Col2Items, data)),
    0,
    l
  );
};

export const hasLockedResults = (l: List<CollectionResponseData>) =>
  L.foldl(
    (hasLocked, data) =>
      hasLocked ||
      L.some(shouldDisplayLock, Fold.toList(_Col2ContentGridCardData, data)),
    false,
    l
  );

import * as L from "@discovery/prelude/lib/data/list";
import { Fold } from "@discovery/prelude/lib/control/lens";
import {
  _RouteResponse2Route,
  _Route2Page,
  _Col2Collection,
  _PageGetter,
  _Col2Items,
  _PageItem2Collection,
} from "@discovery/sonic-api-ng-optics";
import * as Res from "@discovery/sonic-api-ng/lib/japi/response";
import { CollectionResponseData } from "@discovery/sonic-api-ng/lib/api/cms/collections/resource";
import { RouteResponse } from "@discovery/sonic-api-ng/lib/api/cms/routes/resource";

export const _PageResponse2PageCollections = Fold.compose(
  _PageGetter,
  Res._Rel("items"),
  Res._SequenceList(),
  Fold._each(),
  _PageItem2Collection
);

export const _RouteResponse2PageCollections: Fold.Fold<
  RouteResponse,
  CollectionResponseData
> = Fold.compose(
  _RouteResponse2Route,
  _Route2Page,
  Res._Rel("items"),
  Res._SequenceList(),
  Fold._each(),
  _PageItem2Collection
);

export const countResults = (response: RouteResponse) => {
  const l: L.List<CollectionResponseData> = Fold.toList(
    _RouteResponse2PageCollections,
    response
  );
  return L.foldl(
    (sum, data) => {
      const collection = Fold.toList(_Col2Collection, data);
      const collectionItems = L.chain(
        (x) => Fold.toList(_Col2Items, x),
        collection
      );
      return sum + L.length(collectionItems);
    },
    0,
    l
  );
};
